import { Inject } from 'typedi';
import { CashflowTableInjectable } from './CashflowTableInjectable';
import { TableSheetPdf } from '../TableSheetPdf';
import { ICashFlowStatementQuery } from '@/interfaces';
import { HtmlTableCustomCss } from './constants';

export class CashflowTablePdfInjectable {
  @Inject()
  private cashflowTable: CashflowTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given cashflow sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: ICashFlowStatementQuery
  ): Promise<Buffer> {
    const table = await this.cashflowTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  }
}
