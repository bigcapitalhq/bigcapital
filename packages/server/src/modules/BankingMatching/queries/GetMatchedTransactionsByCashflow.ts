import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionCashflowTransformer } from './GetMatchedTransactionCashflowTransformer';
import { ERRORS, GetMatchedTransactionsByTypeFilter } from '../types';
import { ServiceError } from '@/modules/Items/ServiceError';
import { BankTransaction } from '@/modules/BankingTransactions/models/BankTransaction';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetMatchedTransactionsByCashflow extends GetMatchedTransactionsByType {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(BankTransaction.name)
    private readonly bankTransactionModel: TenantModelProxy<
      typeof BankTransaction
    >,
  ) {
    super();
  }

  /**
   * Retrieve the matched transactions of cash flow.
   * @param {GetMatchedTransactionsByTypeFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    filter: Omit<GetMatchedTransactionsByTypeFilter, 'transactionType'>,
  ) {
    const transactions = await this.bankTransactionModel()
      .query()
      .onBuild((q) => {
        // Not matched to bank transaction.
        q.whereNotExists(this.matchedAsCashflowTransactionQuery());

        // Not categorized.
        q.modify('notCategorized');

        // Published.
        q.modify('published');

        // Only transactions recorded on the bank transactions' accounts.
        q.whereIn('cashflowAccountId', filter.accountIds);

        if (filter.fromDate) {
          q.where('date', '>=', filter.fromDate);
        }
        if (filter.toDate) {
          q.where('date', '<=', filter.toDate);
        }
        q.orderBy('date', 'DESC');
      });

    return this.transformer.transform(
      transactions,
      new GetMatchedTransactionCashflowTransformer(),
    );
  }

  /**
   * Retrieves the matched transaction of cash flow, only when it's recorded on
   * one of the given bank accounts.
   * @param {number} transactionId
   * @param {Array<number>} accountIds - Accounts of the bank transactions being matched.
   * @returns
   */
  async getMatchedTransaction(
    transactionId: number,
    accountIds: Array<number>,
  ) {
    const transactions = await this.bankTransactionModel()
      .query()
      .findById(transactionId)
      .whereNotExists(this.matchedAsCashflowTransactionQuery())
      .modify('notCategorized')
      .modify('published')
      .throwIfNotFound();

    if (!accountIds.includes(transactions.cashflowAccountId)) {
      throw new ServiceError(ERRORS.MATCHING_TRANSACTION_ACCOUNT_INVALID);
    }
    return this.transformer.transform(
      transactions,
      new GetMatchedTransactionCashflowTransformer(),
    );
  }

  /**
   * Subquery of the bank matches of the outer cash flow transaction.
   * Matches are stored with the `CashflowTransaction` reference type, which
   * the `BankTransaction.matchedBankTransaction` relation doesn't filter by.
   */
  private matchedAsCashflowTransactionQuery() {
    return this.matchedBankTransactionModel()
      .query()
      .where('referenceType', 'CashflowTransaction')
      .whereColumn('referenceId', 'cashflowTransactions.id');
  }
}
