import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { IARAgingSummaryQuery } from './ARAgingSummary.types';
import { TableSheet } from '../../common/TableSheet';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ARAgingSummaryExportInjectable {
  constructor(
    private readonly ARAgingSummaryTable: ARAgingSummaryTableInjectable,
  ) {}

  /**
   * Retrieves the A/R aging summary sheet in XLSX format.
   * @param {IARAgingSummaryQuery} query - A/R aging summary query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(
    query: IARAgingSummaryQuery
  ): Promise<Buffer> {
    const table = await this.ARAgingSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the A/R aging summary sheet in CSV format.
   * @param {IARAgingSummaryQuery} query - A/R aging summary query.
   * @returns {Promise<string>}
   */
  public async csv(
    query: IARAgingSummaryQuery
  ): Promise<string> {
    const table = await this.ARAgingSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
