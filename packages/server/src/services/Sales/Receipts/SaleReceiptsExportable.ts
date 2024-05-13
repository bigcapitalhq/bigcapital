import { Inject, Service } from 'typedi';
import { ISalesReceiptsFilter } from '@/interfaces';
import { Exportable } from '@/services/Export/Exportable';
import { SaleReceiptApplication } from './SaleReceiptApplication';

@Service()
export class SaleReceiptsExportable extends Exportable {
  @Inject()
  private saleReceiptsApp: SaleReceiptApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: ISalesReceiptsFilter) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: 12,
    } as ISalesReceiptsFilter;

    return this.saleReceiptsApp
      .getSaleReceipts(tenantId, parsedQuery)
      .then((output) => output.data);
  }
}
