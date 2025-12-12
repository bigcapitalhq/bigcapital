import { Injectable } from '@nestjs/common';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { HtmlTableCss } from '../AgingSummary/_constants';
import { APAgingSummaryQueryDto } from './APAgingSummaryQuery.dto';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';

@Injectable()
export class APAgingSummaryPdfInjectable {
  constructor(
    private readonly APAgingSummaryTable: APAgingSummaryTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) {}

  /**
   * Converts the given A/P aging summary sheet table to pdf.
   * @param {APAgingSummaryQueryDto} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: APAgingSummaryQueryDto): Promise<Buffer> {
    const table = await this.APAgingSummaryTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedAsDate,
      HtmlTableCss,
    );
  }
}
