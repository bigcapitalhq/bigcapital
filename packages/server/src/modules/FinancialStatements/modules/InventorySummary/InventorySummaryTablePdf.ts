import { Injectable } from '@nestjs/common';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { InventorySummaryTableInjectable } from './InventorySummaryTableInjectable';
import { IInventorySummaryQuery } from './InventorySummary.types';
import { HtmlTableCustomCss } from './constants';

@Injectable()
export class InventorySummaryTablePdf {
  constructor(
    private readonly inventorySummaryTable: InventorySummaryTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) {}

  /**
   * Retrieve the inventory summary report in PDF format.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: IInventorySummaryQuery): Promise<Buffer> {
    const table = await this.inventorySummaryTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss,
      query.numberFormat?.showInRed,
    );
  }
}
