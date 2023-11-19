import { IVendorBalanceSummaryQuery } from '@/interfaces';
import { VendorBalanceSummaryTableInjectable } from './VendorBalanceSummaryTableInjectable';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { Inject, Service } from 'typedi';

@Service()
export class VendorBalanceSummaryExportInjectable {
  @Inject()
  private customerBalanceSummaryTable: VendorBalanceSummaryTableInjectable;

  /**
   * Retrieves the vendor balance summary sheet in XLSX format.
   * @param {number} tenantId
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: IVendorBalanceSummaryQuery) {
    const table = await this.customerBalanceSummaryTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the vendor balance summary sheet in CSV format.
   * @param {number} tenantId
   * @param {IVendorBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: IVendorBalanceSummaryQuery
  ): Promise<string> {
    const table = await this.customerBalanceSummaryTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
