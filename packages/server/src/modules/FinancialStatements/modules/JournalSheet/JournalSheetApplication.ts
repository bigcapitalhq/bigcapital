import { Injectable } from '@nestjs/common';
import { JournalSheetService } from './JournalSheetService';
import { JournalSheetTableInjectable } from './JournalSheetTableInjectable';
import { JournalSheetExportInjectable } from './JournalSheetExport';
import { JournalSheetPdfInjectable } from './JournalSheetPdfInjectable';
import { IJournalReportQuery, IJournalTable } from './JournalSheet.types';

@Injectable()
export class JournalSheetApplication {
  constructor(
    private readonly journalSheetTable: JournalSheetTableInjectable,
    private readonly journalSheet: JournalSheetService,
    private readonly journalExport: JournalSheetExportInjectable,
    private readonly journalPdf: JournalSheetPdfInjectable,
  ) {}

  /**
   * Retrieves the journal sheet.
   * @param {IJournalReportQuery} query
   * @returns {Promise<IJournalSheet>}
   */
  public sheet(query: IJournalReportQuery) {
    return this.journalSheet.journalSheet(query);
  }

  /**
   * Retrieves the journal sheet in table format.
   * @param {IJournalReportQuery} query
   * @returns {Promise<IJournalTable>}
   */
  public table(query: IJournalReportQuery): Promise<IJournalTable> {
    return this.journalSheetTable.table(query);
  }

  /**
   * Retrieves the journal sheet in xlsx format.
   * @param {IJournalReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: IJournalReportQuery) {
    return this.journalExport.xlsx(query);
  }

  /**
   * Retrieves the journal sheet in csv format.
   * @param {IJournalReportQuery} query
   * @returns {Promise<string>}
   */
  public csv(query: IJournalReportQuery) {
    return this.journalExport.csv(query);
  }

  /**
   * Retrieves the journal sheet in pdf format.
   * @param {IJournalReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IJournalReportQuery) {
    return this.journalPdf.pdf(query);
  }
}
