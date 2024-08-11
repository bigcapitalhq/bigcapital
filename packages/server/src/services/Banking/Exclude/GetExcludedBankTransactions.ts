import { Inject, Service } from 'typedi';
import moment from 'moment';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ExcludedBankTransactionsQuery } from './_types';
import { UncategorizedTransactionTransformer } from '@/services/Cashflow/UncategorizedTransactionTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetExcludedBankTransactionsService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the excluded uncategorized bank transactions.
   * @param {number} tenantId
   * @param {ExcludedBankTransactionsQuery} filter
   * @returns
   */
  public async getExcludedBankTransactions(
    tenantId: number,
    filter: ExcludedBankTransactionsQuery
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    // Parsed query with default values.
    const _query = {
      page: 1,
      pageSize: 20,
      ...filter,
    };
    const { results, pagination } =
      await UncategorizedCashflowTransaction.query()
        .onBuild((q) => {
          q.modify('excluded');
          q.orderBy('date', 'DESC');

          if (_query.accountId) {
            q.where('account_id', _query.accountId);
          }
          if (_query.minDate) {
            q.modify('fromDate', _query.minDate);
          }
          if (_query.maxDate) {
            q.modify('toDate', _query.maxDate);
          }
          if (_query.minAmount) {
            q.modify('minAmount', _query.minAmount);
          }
          if (_query.maxAmount) {
            q.modify('maxAmount', _query.maxAmount);
          }
        })
        .pagination(_query.page - 1, _query.pageSize);

    const data = await this.transformer.transform(
      tenantId,
      results,
      new UncategorizedTransactionTransformer()
    );
    return { data, pagination };
  }
}
