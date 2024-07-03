import { Inject, Service } from 'typedi';
import { GetMatchedTransactionsFilter, MatchedTransactionPOJO } from './types';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionExpensesTransformer } from './GetMatchedTransactionExpensesTransformer';

@Service()
export class GetMatchedTransactionsByExpenses extends GetMatchedTransactionsByType {
  @Inject()
  protected tenancy: HasTenancyService;

  @Inject()
  protected transformer: TransformerInjectable;

  /**
   * Retrieves the matched transactions of expenses.
   * @param {number} tenantId
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { Expense } = this.tenancy.models(tenantId);

    const expenses = await Expense.query().onBuild((query) => {
      query.whereNotExists(Expense.relatedQuery('matchedBankTransaction'));
      if (filter.fromDate) {
        query.where('payment_date', '>=', filter.fromDate);
      }
      if (filter.toDate) {
        query.where('payment_date', '<=', filter.toDate);
      }
      if (filter.minAmount) {
        query.where('total_amount', '>=', filter.minAmount);
      }
      if (filter.maxAmount) {
        query.where('total_amount', '<=', filter.maxAmount);
      }
    });
    return this.transformer.transform(
      tenantId,
      expenses,
      new GetMatchedTransactionExpensesTransformer()
    );
  }

  /**
   * Retrieves the given matched expense transaction.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns {GetMatchedTransactionExpensesTransformer-}
   */
  public async getMatchedTransaction(
    tenantId: number,
    transactionId: number
  ): Promise<MatchedTransactionPOJO> {
    const { Expense } = this.tenancy.models(tenantId);

    const expense = await Expense.query()
      .findById(transactionId)
      .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      expense,
      new GetMatchedTransactionExpensesTransformer()
    );
  }
}
