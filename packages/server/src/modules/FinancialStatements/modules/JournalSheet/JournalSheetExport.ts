import { IJournalReportQuery } from './JournalSheet.types';
import { JournalSheetTableInjectable } from './JournalSheetTableInjectable';
import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';

@Injectable()
export class JournalSheetExportInjectable {
  constructor(
    private readonly journalSheetTable: JournalSheetTableInjectable,
  ) {}

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {IJournalReportQuery} query - Journal report query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IJournalReportQuery) {
    const table = await this.journalSheetTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {IJournalReportQuery} query - Journal report query.
   * @returns {Promise<Buffer>}
   */
  public async csv(query: IJournalReportQuery): Promise<string> {
    const table = await this.journalSheetTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
