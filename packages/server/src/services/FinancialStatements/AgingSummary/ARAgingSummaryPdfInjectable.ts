import { Inject, Service } from 'typedi';
import { IARAgingSummaryQuery } from '@/interfaces';
import { TableSheetPdf } from '../TableSheetPdf';
import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { HtmlTableCss } from './_constants';

@Service()
export class ARAgingSummaryPdfInjectable {
  @Inject()
  private ARAgingSummaryTable: ARAgingSummaryTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given balance sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: IARAgingSummaryQuery
  ): Promise<Buffer> {
    const table = await this.ARAgingSummaryTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCss
    );
  }
}
