import { IJournalReportQuery } from '@/interfaces';
import { TableSheetPdf } from '../TableSheetPdf';
import { JournalSheetTableInjectable } from './JournalSheetTableInjectable';
import { Inject, Service } from 'typedi';
import { HtmlTableCustomCss } from './constant';

@Service()
export class JournalSheetPdfInjectable {
  @Inject()
  private journalSheetTable: JournalSheetTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given journal sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: IJournalReportQuery
  ): Promise<Buffer> {
    const table = await this.journalSheetTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  }
}
