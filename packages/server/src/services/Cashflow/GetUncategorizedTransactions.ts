import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { UncategorizedTransactionTransformer } from './UncategorizedTransactionTransformer';
import { IGetUncategorizedTransactionsQuery } from '@/interfaces';

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
  public async getTransactions(
    tenantId: number,
    accountId: number,
    query: IGetUncategorizedTransactionsQuery
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    // Parsed query with default values.
    const _query = {
      page: 1,
      pageSize: 20,
      ...query,
    };
    const { results, pagination } =
      await UncategorizedCashflowTransaction.query()
        .where('accountId', accountId)
        .where('categorized', false)
        .withGraphFetched('account')
        .orderBy('date', 'DESC')
        .pagination(_query.page - 1, _query.pageSize);

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
