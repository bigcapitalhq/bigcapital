import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { TableSheet } from '../../common/TableSheet';
import { Injectable } from '@nestjs/common';
import { ARAgingSummaryQueryDto } from './ARAgingSummaryQuery.dto';

@Injectable()
export class ARAgingSummaryExportInjectable {
  constructor(
    private readonly ARAgingSummaryTable: ARAgingSummaryTableInjectable,
  ) {}

  /**
   * Retrieves the A/R aging summary sheet in XLSX format.
   * @param {ARAgingSummaryQueryDto} query - A/R aging summary query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ARAgingSummaryQueryDto): Promise<Buffer> {
    const table = await this.ARAgingSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the A/R aging summary sheet in CSV format.
   * @param {ARAgingSummaryQueryDto} query - A/R aging summary query.
   * @returns {Promise<string>}
   */
  public async csv(query: ARAgingSummaryQueryDto): Promise<string> {
    const table = await this.ARAgingSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
