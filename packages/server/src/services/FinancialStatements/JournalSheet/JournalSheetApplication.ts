import { Inject } from 'typedi';
import { JournalSheetService } from './JournalSheetService';
import { JournalSheetTableInjectable } from './JournalSheetTableInjectable';
import { IJournalReportQuery, IJournalTable } from '@/interfaces';
import { JournalSheetExportInjectable } from './JournalSheetExport';
import { JournalSheetPdfInjectable } from './JournalSheetPdfInjectable';

export class JournalSheetApplication {
  @Inject()
  private journalSheetTable: JournalSheetTableInjectable;

  @Inject()
  private journalSheet: JournalSheetService;

  @Inject()
  private journalExport: JournalSheetExportInjectable;

  @Inject()
  private journalPdf: JournalSheetPdfInjectable;

  /**
   * Retrieves the journal sheet.
   * @param {number} tenantId
   * @param {IJournalReportQuery} query
   * @returns {}
   */
  public sheet(tenantId: number, query: IJournalReportQuery) {
    return this.journalSheet.journalSheet(tenantId, query);
  }

  /**
   * Retrieves the journal sheet in table format.
   * @param {number} tenantId
   * @param {IJournalReportQuery} query
   * @returns {Promise<IJournalTable>}
   */
  public table(
    tenantId: number,
    query: IJournalReportQuery
  ): Promise<IJournalTable> {
    return this.journalSheetTable.table(tenantId, query);
  }

  /**
   * Retrieves the journal sheet in xlsx format.
   * @param {number} tenantId
   * @param {IJournalReportQuery} query
   * @returns
   */
  public xlsx(tenantId: number, query: IJournalReportQuery) {
    return this.journalExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the journal sheet in csv format.
   * @param {number} tenantId
   * @param {IJournalReportQuery} query
   * @returns
   */
  public csv(tenantId: number, query: IJournalReportQuery) {
    return this.journalExport.csv(tenantId, query);
  }

  /**
   * Retrieves the journal sheet in pdf format. 
   * @param {number} tenantId 
   * @param {IJournalReportQuery} query 
   * @returns {Promise<Buffer>}
   */
  public pdf(tenantId: number, query: IJournalReportQuery) {
    return this.journalPdf.pdf(tenantId, query);
  }
}
