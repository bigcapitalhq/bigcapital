import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';
import { ISalesByItemsReportQuery } from './SalesByItems.types';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';

@Injectable()
export class SalesByItemsExport {
  constructor(
    private readonly salesByItemsTable: SalesByItemsTableInjectable,
  ) {}

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {ISalesByItemsReportQuery} query - Sales by items report query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ISalesByItemsReportQuery) {
    const table = await this.salesByItemsTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {ISalesByItemsReportQuery} query - Sales by items report query.
   * @returns {Promise<Buffer>}
   */
  public async csv(query: ISalesByItemsReportQuery): Promise<string> {
    const table = await this.salesByItemsTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
