import { Inject, Service } from 'typedi';
import { IAPAgingSummaryQuery } from '@/interfaces';
import { TableSheetPdf } from '../TableSheetPdf';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';
import { HtmlTableCss } from './_constants';

@Service()
export class APAgingSummaryPdfInjectable {
  @Inject()
  private APAgingSummaryTable: APAgingSummaryTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given A/P aging summary sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IAPAgingSummaryQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: IAPAgingSummaryQuery
  ): Promise<Buffer> {
    const table = await this.APAgingSummaryTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedAsDate,
      HtmlTableCss
    );
  }
}
