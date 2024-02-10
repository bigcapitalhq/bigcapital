import { Inject, Service } from 'typedi';
import { ITrialBalanceSheetQuery } from '@/interfaces';
import { TableSheetPdf } from '../TableSheetPdf';
import { TrialBalanceSheetTableInjectable } from './TrialBalanceSheetTableInjectable';

@Service()
export class TrialBalanceSheetPdfInjectable {
  @Inject()
  private trialBalanceSheetTable: TrialBalanceSheetTableInjectable;

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
    query: ITrialBalanceSheetQuery
  ): Promise<Buffer> {
    const table = await this.trialBalanceSheetTable.table(tenantId, query);
    const sheetName = 'Trial Balance Sheet';

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      sheetName,
      table.meta.baseCurrency
    );
  }
}
