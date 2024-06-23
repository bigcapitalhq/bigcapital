import { Inject, Service } from 'typedi';
import { GetMatchedTransactionsFilter } from './types';
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
}
