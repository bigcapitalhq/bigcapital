import { Inject, Injectable } from '@nestjs/common';
import { GetMatchedTransactionsFilter, MatchedTransactionPOJO } from '../types';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionExpensesTransformer } from './GetMatchedTransactionExpensesTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Expense } from '@/modules/Expenses/models/Expense.model';

@Injectable()
export class GetMatchedTransactionsByExpenses extends GetMatchedTransactionsByType {
  constructor(
    protected readonly transformer: TransformerInjectable,

    @Inject(Expense.name)
    protected readonly expenseModel: typeof Expense,
  ) {
    super();
  }

  /**
   * Retrieves the matched transactions of expenses.
   * @param {number} tenantId
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getMatchedTransactions(filter: GetMatchedTransactionsFilter) {
    // Retrieve the expense matches.
    const expenses = await this.expenseModel.query().onBuild((query) => {
      // Filter out the not matched to bank transactions.
      query.withGraphJoined('matchedBankTransaction');
      query.whereNull('matchedBankTransaction.id');

      // Filter the published onyl
      query.modify('filterByPublished');

      if (filter.fromDate) {
        query.where('paymentDate', '>=', filter.fromDate);
      }
      if (filter.toDate) {
        query.where('paymentDate', '<=', filter.toDate);
      }
      if (filter.minAmount) {
        query.where('totalAmount', '>=', filter.minAmount);
      }
      if (filter.maxAmount) {
        query.where('totalAmount', '<=', filter.maxAmount);
      }
      query.orderBy('paymentDate', 'DESC');
    });
    return this.transformer.transform(
      expenses,
      new GetMatchedTransactionExpensesTransformer(),
    );
  }

  /**
   * Retrieves the given matched expense transaction.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns {GetMatchedTransactionExpensesTransformer-}
   */
  public async getMatchedTransaction(
    transactionId: number,
  ): Promise<MatchedTransactionPOJO> {
    const expense = await this.expenseModel
      .query()
      .findById(transactionId)
      .throwIfNotFound();

    return this.transformer.transform(
      expense,
      new GetMatchedTransactionExpensesTransformer(),
    );
  }
}
