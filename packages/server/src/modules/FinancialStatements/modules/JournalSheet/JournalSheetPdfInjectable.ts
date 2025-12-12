import { Injectable } from '@nestjs/common';
import { JournalSheetTableInjectable } from './JournalSheetTableInjectable';
import { HtmlTableCustomCss } from './constant';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { IJournalReportQuery } from './JournalSheet.types';

@Injectable()
export class JournalSheetPdfInjectable {
  constructor(
    private readonly journalSheetTable: JournalSheetTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) { }

  /**
   * Converts the given journal sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: IJournalReportQuery): Promise<Buffer> {
    const table = await this.journalSheetTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss,
    );
  }
}
