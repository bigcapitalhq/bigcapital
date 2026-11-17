import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';
import { IInventorySummaryQuery } from './InventorySummary.types';
import { InventorySummaryTableInjectable } from './InventorySummaryTableInjectable';

@Injectable()
export class InventorySummaryExportInjectable {
  constructor(
    private readonly inventorySummaryTable: InventorySummaryTableInjectable,
  ) {}

  /**
   * Retrieve the inventory summary report in XLSX format.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IInventorySummaryQuery): Promise<Buffer> {
    const table = await this.inventorySummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieve the inventory summary report in CSV format.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<string>}
   */
  public async csv(query: IInventorySummaryQuery): Promise<string> {
    const table = await this.inventorySummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    return tableSheet.convertToCSV();
  }
}
