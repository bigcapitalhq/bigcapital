import { Inject } from 'typedi';
import { CashflowTableInjectable } from './CashflowTableInjectable';
import { TableSheetPdf } from '../TableSheetPdf';
import { ICashFlowStatementQuery } from '@/interfaces';

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
    const sheetName = 'Cashflow Sheet';

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      sheetName,
      table.meta.baseCurrency
    );
  }
}
