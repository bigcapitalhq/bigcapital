import { Injectable } from '@nestjs/common';
import { IVendorBalanceSummaryQuery } from './VendorBalanceSummary.types';
import { VendorBalanceSummaryTableInjectable } from './VendorBalanceSummaryTableInjectable';
import { TableSheet } from '../../common/TableSheet';

@Injectable()
export class VendorBalanceSummaryExportInjectable {
  constructor(
    private readonly customerBalanceSummaryTable: VendorBalanceSummaryTableInjectable,
  ) {}

  /**
   * Retrieves the vendor balance summary sheet in XLSX format.
   * @param {IVendorBalanceSummaryQuery} query - Query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IVendorBalanceSummaryQuery) {
    const table = await this.customerBalanceSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the vendor balance summary sheet in CSV format.
   * @param {IVendorBalanceSummaryQuery} query - Query.
   * @returns {Promise<string>}
   */
  public async csv(query: IVendorBalanceSummaryQuery): Promise<string> {
    const table = await this.customerBalanceSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
