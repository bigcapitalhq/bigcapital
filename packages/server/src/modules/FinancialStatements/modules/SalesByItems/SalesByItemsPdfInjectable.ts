import { ISalesByItemsReportQuery } from './SalesByItems.types';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { HtmlTableCustomCss } from './constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SalesByItemsPdfInjectable {
  constructor(
    private readonly salesByItemsTable: SalesByItemsTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) { }

  /**
   * Retrieves the sales by items sheet in pdf format.
   * @param {ISalesByItemsReportQuery} query - The query to apply to the report.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    query: ISalesByItemsReportQuery,
  ): Promise<Buffer> {
    const table = await this.salesByItemsTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss,
    );
  }
}
