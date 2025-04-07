import { TableSheetPdf } from '../../common/TableSheetPdf';
import { HtmlTableCss } from '../AgingSummary/_constants';
import { IAPAgingSummaryQuery } from './APAgingSummary.types';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class APAgingSummaryPdfInjectable {
  constructor(
    private readonly APAgingSummaryTable: APAgingSummaryTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) {}

  /**
   * Converts the given A/P aging summary sheet table to pdf.
   * @param {IAPAgingSummaryQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: IAPAgingSummaryQuery): Promise<Buffer> {
    const table = await this.APAgingSummaryTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.sheetName,
      table.meta.formattedAsDate,
      HtmlTableCss,
    );
  }
}
