import { Inject, Service } from 'typedi';
import { ISalesInvoicesFilter } from '@/interfaces';
import { Exportable } from '@/services/Export/Exportable';
import { SaleEstimatesApplication } from './SaleEstimatesApplication';
import { EXPORT_SIZE_LIMIT } from '@/services/Export/constants';

@Service()
export class SaleEstimatesExportable extends Exportable {
  @Inject()
  private saleEstimatesApplication: SaleEstimatesApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: ISalesInvoicesFilter) {
    const filterQuery = (query) => {
      query.withGraphFetched('branch');
      query.withGraphFetched('warehouse');
    };
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
      filterQuery,
    } as ISalesInvoicesFilter;

    return this.saleEstimatesApplication
      .getSaleEstimates(tenantId, parsedQuery)
      .then((output) => output.salesEstimates);
  }
}
