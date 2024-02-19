import { Inject, Service } from 'typedi';
import { ISalesByItemsReportQuery } from '@/interfaces';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';
import { TableSheetPdf } from '../TableSheetPdf';
import { HtmlTableCustomCss } from './constants';

@Service()
export class SalesByItemsPdfInjectable {
  @Inject()
  private salesByItemsTable: SalesByItemsTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Retrieves the sales by items sheet in pdf format.
   * @param {number} tenantId
   * @param {number} query
   * @returns {Promise<IBalanceSheetTable>}
   */
  public async pdf(
    tenantId: number,
    query: ISalesByItemsReportQuery
  ): Promise<Buffer> {
    const table = await this.salesByItemsTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  }
}
