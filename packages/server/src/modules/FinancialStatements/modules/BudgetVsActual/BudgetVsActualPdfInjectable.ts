import { Injectable } from '@nestjs/common';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { BudgetVsActualTableInjectable } from './BudgetVsActualTableInjectable';
import { HtmlTableCustomCss } from './constants';
import { IBudgetVsActualQuery } from './BudgetVsActual.types';

@Injectable()
export class BudgetVsActualPdfInjectable {
  constructor(
    private readonly budgetVsActualTable: BudgetVsActualTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) {}

  /**
   * Converts the given budget vs actual table to pdf.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: IBudgetVsActualQuery): Promise<Buffer> {
    const table = await this.budgetVsActualTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss,
    );
  }
}
