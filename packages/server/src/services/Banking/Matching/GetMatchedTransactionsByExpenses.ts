import { Inject, Service } from 'typedi';
import { GetMatchedTransactionManualJournalsTransformer } from './GetMatchedTransactionManualJournalsTransformer';
import { GetMatchedTransactionsFilter } from './types';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class GetMatchedTransactionsByExpenses {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   *
   * @param {number} tenantId
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { Expense } = this.tenancy.models(tenantId);

    const expenses = await Expense.query();

    return this.transformer.transform(
      tenantId,
      expenses,
      new GetMatchedTransactionManualJournalsTransformer()
    );
  }
}
