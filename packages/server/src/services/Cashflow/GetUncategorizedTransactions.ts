import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { UncategorizedTransactionTransformer } from './UncategorizedTransactionTransformer';

@Service()
export class GetUncategorizedTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the uncategorized cashflow transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} accountId - Account Id.
   */
  public async getTransactions(tenantId: number, accountId: number) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const { results, pagination } =
      await UncategorizedCashflowTransaction.query()
        .where('accountId', accountId)
        .where('categorized', false)
        .withGraphFetched('account')
        .pagination(0, 10);

    const data = await this.transformer.transform(
      tenantId,
      results,
      new UncategorizedTransactionTransformer()
    );
    return {
      data,
      pagination,
    };
  }
}
