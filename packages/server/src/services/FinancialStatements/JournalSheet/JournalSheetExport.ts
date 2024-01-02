import { Inject, Service } from 'typedi';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { IJournalReportQuery } from '@/interfaces';
import { JournalSheetTableInjectable } from './JournalSheetTableInjectable';

@Service()
export class JournalSheetExportInjectable {
  @Inject()
  private journalSheetTable: JournalSheetTableInjectable;

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {IJournalReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: IJournalReportQuery) {
    const table = await this.journalSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {number} tenantId
   * @param {IJournalReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: IJournalReportQuery
  ): Promise<string> {
    const table = await this.journalSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
