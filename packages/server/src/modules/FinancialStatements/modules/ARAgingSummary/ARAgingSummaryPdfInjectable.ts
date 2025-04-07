import { Injectable } from '@nestjs/common';
import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { IARAgingSummaryQuery } from './ARAgingSummary.types';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { HtmlTableCss } from '../AgingSummary/_constants';

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
  public async pdf(query: IARAgingSummaryQuery): Promise<Buffer> {
    const table = await this.ARAgingSummaryTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCss,
    );
  }
}
