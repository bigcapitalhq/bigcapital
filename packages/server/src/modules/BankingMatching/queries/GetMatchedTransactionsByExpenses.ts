import { Inject, Injectable } from '@nestjs/common';
import {
  GetMatchedTransactionsFilter,
  MatchedTransactionPOJO,
  MatchedTransactionsPOJO,
} from '../types';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionExpensesTransformer } from './GetMatchedTransactionExpensesTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Expense } from '@/modules/Expenses/models/Expense.model';
import { ExpensePaymentSplit } from '@/modules/Expenses/models/ExpensePaymentSplit.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetMatchedTransactionsByExpenses extends GetMatchedTransactionsByType {
  constructor(
    protected readonly transformer: TransformerInjectable,

    @Inject(Expense.name)
    protected readonly expenseModel: TenantModelProxy<typeof Expense>,

    @Inject(ExpensePaymentSplit.name)
    protected readonly expensePaymentSplitModel: TenantModelProxy<
      typeof ExpensePaymentSplit
    >,
  ) {
    super();
  }

  /**
   * Retrieves the matched transactions of expenses as one candidate row per
   * unmatched payment split. Expenses that carry a single split (the
   * backfill case) render as a single row equivalent to the legacy behavior.
   */
  async getMatchedTransactions(
    filter: GetMatchedTransactionsFilter,
  ): Promise<MatchedTransactionsPOJO> {
    const splits = await this.expensePaymentSplitModel()
      .query()
      .withGraphJoined('expense')
      .onBuild((query) => {
        // Parent expense must be published (payment date non-null).
        query.whereNotNull('expense.publishedAt');

        // Bank transactions live on a specific account; only offer splits
        // drawn from that account as candidates.
        if (filter.paymentAccountId) {
          query.where(
            'expense_payment_splits.paymentAccountId',
            filter.paymentAccountId,
          );
        }
        if (filter.fromDate) {
          query.where('expense.paymentDate', '>=', filter.fromDate);
        }
        if (filter.toDate) {
          query.where('expense.paymentDate', '<=', filter.toDate);
        }
        if (filter.minAmount) {
          query.where(
            'expense_payment_splits.amount',
            '>=',
            filter.minAmount,
          );
        }
        if (filter.maxAmount) {
          query.where(
            'expense_payment_splits.amount',
            '<=',
            filter.maxAmount,
          );
        }

        // Exclude splits that already have a match row.
        query.whereNotExists(function () {
          this.select('id')
            .from('matched_bank_transactions')
            .where('matched_bank_transactions.reference_type', 'Expense')
            .whereRaw(
              'matched_bank_transactions.reference_id = expense.id',
            )
            .whereRaw(
              'matched_bank_transactions.reference_sub_id = expense_payment_splits.id',
            );
        });

        query.orderBy('expense.paymentDate', 'DESC');
      });

    return this.transformer.transform(
      splits,
      new GetMatchedTransactionExpensesTransformer(),
    );
  }

  /**
   * Retrieves a single matched expense candidate.
   * @param {number} transactionId - Expense id.
   * @param {number} [referenceSubId] - Payment split id; when provided the
   *   candidate is the split's amount, otherwise the whole expense total
   *   (legacy callers).
   */
  public async getMatchedTransaction(
    transactionId: number,
    referenceSubId?: number,
  ): Promise<MatchedTransactionPOJO> {
    if (referenceSubId) {
      const split = await this.expensePaymentSplitModel()
        .query()
        .findById(referenceSubId)
        .withGraphFetched('expense')
        .throwIfNotFound();
      // Guard against a client pairing a split id with a different expense.
      if (split.expenseId !== transactionId) {
        throw new Error(
          `Payment split ${referenceSubId} does not belong to expense ${transactionId}`,
        );
      }
      return this.transformer.transform(
        split,
        new GetMatchedTransactionExpensesTransformer(),
      );
    }

    const expense = await this.expenseModel()
      .query()
      .findById(transactionId)
      .throwIfNotFound();

    return this.transformer.transform(
      expense,
      new GetMatchedTransactionExpensesTransformer(),
    );
  }
}
