import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';
import { PurchasesByItemsTableInjectable } from './PurchasesByItemsTableInjectable';
import { IPurchasesByItemsReportQuery } from './types/PurchasesByItems.types';

@Injectable()
export class PurchasesByItemsExport {
  constructor(
    private purchasesByItemsTableInjectable: PurchasesByItemsTableInjectable,
  ) {}

  /**
   * Retrieves the purchases by items sheet in XLSX format.
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IPurchasesByItemsReportQuery): Promise<Buffer> {
    const table = await this.purchasesByItemsTableInjectable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the purchases by items sheet in CSV format.
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(query: IPurchasesByItemsReportQuery): Promise<string> {
    const table = await this.purchasesByItemsTableInjectable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
