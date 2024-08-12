import { Inject } from 'typedi';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '../Tenancy/TenancyService';
import { GetPendingBankAccountTransactionTransformer } from './GetPendingBankAccountTransactionTransformer';

export class GetPendingBankAccountTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the given bank accounts pending transaction.
   * @param {number} tenantId - Tenant id.
   * @param {GetPendingTransactionsQuery} filter - Pending transactions query.
   */
  async getPendingTransactions(
    tenantId: number,
    filter?: GetPendingTransactionsQuery
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const _filter = {
      page: 1,
      pageSize: 20,
      ...filter,
    };
    const { results, pagination } =
      await UncategorizedCashflowTransaction.query()
        .onBuild((q) => {
          q.modify('pending');

          if (_filter?.accountId) {
            q.where('accountId', _filter.accountId);
          }
        })
        .pagination(_filter.page - 1, _filter.pageSize);

    const data = await this.transformer.transform(
      tenantId,
      results,
      new GetPendingBankAccountTransactionTransformer()
    );
    return { data, pagination };
  }
}

interface GetPendingTransactionsQuery {
  page?: number;
  pageSize?: number;
  accountId?: number;
}
