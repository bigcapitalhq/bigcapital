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

    const _filter = {
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

          if (_filter.accountId) {
            q.where('accountId', _filter.accountId);
          }
        })
        .pagination(_filter.page - 1, _filter.pageSize);

    const data = await this.transformer.transform(
      tenantId,
      results,
      new GetRecognizedTransactionTransformer()
    );
    return { data, pagination };
  }
}
