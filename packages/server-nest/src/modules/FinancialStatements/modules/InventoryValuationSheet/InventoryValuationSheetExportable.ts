import { TableSheet } from '../../common/TableSheet';
import { IInventoryValuationReportQuery } from './InventoryValuationSheet.types';
import { InventoryValuationSheetTableInjectable } from './InventoryValuationSheetTableInjectable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryValuationSheetExportable {
  constructor(
    private readonly inventoryValuationTable: InventoryValuationSheetTableInjectable,
  ) {}

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {IInventoryValuationReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IInventoryValuationReportQuery): Promise<Buffer> {
    const table = await this.inventoryValuationTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {IInventoryValuationReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(query: IInventoryValuationReportQuery): Promise<string> {
    const table = await this.inventoryValuationTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
