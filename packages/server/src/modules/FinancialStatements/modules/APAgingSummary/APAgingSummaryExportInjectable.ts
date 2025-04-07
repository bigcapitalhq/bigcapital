import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';
import { IAPAgingSummaryQuery } from './APAgingSummary.types';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';

@Injectable()
export class APAgingSummaryExportInjectable {
  constructor(
    private readonly APAgingSummaryTable: APAgingSummaryTableInjectable,
  ) {}

  /**
   * Retrieves the A/P aging summary sheet in XLSX format.
   * @param {IAPAgingSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IAPAgingSummaryQuery) {
    const table = await this.APAgingSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the A/P aging summary sheet in CSV format.
   * @param {IAPAgingSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(query: IAPAgingSummaryQuery): Promise<string> {
    const table = await this.APAgingSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
