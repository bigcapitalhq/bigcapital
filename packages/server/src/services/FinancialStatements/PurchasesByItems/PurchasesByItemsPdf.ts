import { Inject, Service } from 'typedi';
import { TableSheetPdf } from '../TableSheetPdf';
import { PurchasesByItemsTableInjectable } from './PurchasesByItemsTableInjectable';
import { IPurchasesByItemsReportQuery } from '@/interfaces/PurchasesByItemsSheet';
import { HtmlTableCustomCss } from './_types';

@Service()
export class PurchasesByItemsPdf {
  @Inject()
  private purchasesByItemsTable: PurchasesByItemsTableInjectable;

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
    query: IPurchasesByItemsReportQuery
  ): Promise<Buffer> {
    const table = await this.purchasesByItemsTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  }
}
