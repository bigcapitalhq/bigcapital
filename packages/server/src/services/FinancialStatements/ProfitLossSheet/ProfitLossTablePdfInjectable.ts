import { Inject, Service } from 'typedi';
import { IProfitLossSheetQuery } from '@/interfaces';
import { ProfitLossSheetTableInjectable } from './ProfitLossSheetTableInjectable';
import { TableSheetPdf } from '../TableSheetPdf';

@Service()
export class ProfitLossTablePdfInjectable {
  @Inject()
  private profitLossTable: ProfitLossSheetTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Retrieves the profit/loss sheet in pdf format.
   * @param {number} tenantId
   * @param {number} query
   * @returns {Promise<IBalanceSheetTable>}
   */
  public async pdf(
    tenantId: number,
    query: IProfitLossSheetQuery
  ): Promise<Buffer> {
    const table = await this.profitLossTable.table(tenantId, query);
    const sheetName = 'Profit & Loss Sheet';

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      sheetName,
      table.meta.baseCurrency
    );
  }
}
