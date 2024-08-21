import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetRecognizedTransactionTransformer } from './GetRecognizedTransactionTransformer';
import { IGetRecognizedTransactionsQuery } from '@/interfaces';

@Service()
export class GetRecognizedTransactionsService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the recognized transactions of the given account.
   * @param {number} tenantId
   * @param {IGetRecognizedTransactionsQuery} filter -
   */
  async getRecognizedTranactions(
    tenantId: number,
    filter?: IGetRecognizedTransactionsQuery
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const _query = {
      page: 1,
      pageSize: 20,
      ...filter,
    };
    const { results, pagination } =
      await UncategorizedCashflowTransaction.query()
        .onBuild((q) => {
          q.withGraphFetched('recognizedTransaction.assignAccount');
          q.withGraphFetched('recognizedTransaction.bankRule');
          q.whereNotNull('recognizedTransactionId');

          // Exclude the excluded transactions.
          q.modify('notExcluded');

          // Exclude the pending transactions.
          q.modify('notPending');

          if (_query.accountId) {
            q.where('accountId', _query.accountId);
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
          if (_query.accountId) {
            q.where('accountId', _query.accountId);
          }
        })
        .pagination(_query.page - 1, _query.pageSize);

    const data = await this.transformer.transform(
      tenantId,
      results,
      new GetRecognizedTransactionTransformer()
    );
    return { data, pagination };
  }
}
