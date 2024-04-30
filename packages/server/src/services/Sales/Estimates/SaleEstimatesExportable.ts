import { Inject, Service } from 'typedi';
import { ISalesInvoicesFilter } from '@/interfaces';
import { Exportable } from '@/services/Export/Exportable';
import { SaleEstimatesApplication } from './SaleEstimatesApplication';

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
    const parsedQuery = {
      ...query,
    } as ISalesInvoicesFilter;

    return this.saleEstimatesApplication
      .getSaleEstimates(tenantId, parsedQuery)
      .then((output) => output.salesEstimates);
  }
}
