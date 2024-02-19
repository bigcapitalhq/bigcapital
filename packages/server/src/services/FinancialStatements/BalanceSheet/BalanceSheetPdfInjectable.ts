import { Inject, Service } from 'typedi';
import { IBalanceSheetQuery } from '@/interfaces';
import { BalanceSheetTableInjectable } from './BalanceSheetTableInjectable';
import { TableSheetPdf } from '../TableSheetPdf';
import { HtmlTableCustomCss } from './constants';

@Service()
export class BalanceSheetPdfInjectable {
  @Inject()
  private balanceSheetTable: BalanceSheetTableInjectable;

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
    query: IBalanceSheetQuery
  ): Promise<Buffer> {
    const table = await this.balanceSheetTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  }
}
