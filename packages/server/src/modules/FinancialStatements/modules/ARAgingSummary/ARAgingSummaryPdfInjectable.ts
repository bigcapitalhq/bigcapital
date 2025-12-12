import { Injectable } from '@nestjs/common';
import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { HtmlTableCss } from '../AgingSummary/_constants';
import { ARAgingSummaryQueryDto } from './ARAgingSummaryQuery.dto';

@Injectable()
export class ARAgingSummaryPdfInjectable {
  constructor(
    private readonly ARAgingSummaryTable: ARAgingSummaryTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) {}

  /**
   * Converts the given balance sheet table to pdf.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: ARAgingSummaryQueryDto): Promise<Buffer> {
    const table = await this.ARAgingSummaryTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCss,
    );
  }
}
