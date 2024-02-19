import { Inject, Service } from 'typedi';
import { ITrialBalanceSheetQuery } from '@/interfaces';
import { TableSheetPdf } from '../TableSheetPdf';
import { TrialBalanceSheetTableInjectable } from './TrialBalanceSheetTableInjectable';
import { HtmlTableCustomCss } from './_constants';

@Service()
export class TrialBalanceSheetPdfInjectable {
  @Inject()
  private trialBalanceSheetTable: TrialBalanceSheetTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given trial balance sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {ITrialBalanceSheetQuery} query - Trial balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: ITrialBalanceSheetQuery
  ): Promise<Buffer> {
    const table = await this.trialBalanceSheetTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  }
}
