import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';
import { APAgingSummaryQueryDto } from './APAgingSummaryQuery.dto';

@Injectable()
export class APAgingSummaryExportInjectable {
  constructor(
    private readonly APAgingSummaryTable: APAgingSummaryTableInjectable,
  ) {}

  /**
   * Retrieves the A/P aging summary sheet in XLSX format.
   * @param {APAgingSummaryQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: APAgingSummaryQueryDto) {
    const table = await this.APAgingSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the A/P aging summary sheet in CSV format.
   * @param {APAgingSummaryQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public async csv(query: APAgingSummaryQueryDto): Promise<string> {
    const table = await this.APAgingSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
