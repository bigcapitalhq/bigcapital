import { Inject, Service } from 'typedi';
import { ProfitLossSheetExportInjectable } from './ProfitLossSheetExportInjectable';
import { ProfitLossSheetTableInjectable } from './ProfitLossSheetTableInjectable';
import { IProfitLossSheetQuery, IProfitLossSheetTable } from '@/interfaces';
import ProfitLossSheetService from './ProfitLossSheetService';

@Service()
export class ProfitLossSheetApplication {
  @Inject()
  private profitLossTable: ProfitLossSheetTableInjectable;

  @Inject()
  private profitLossExport: ProfitLossSheetExportInjectable;

  @Inject()
  private profitLossSheet: ProfitLossSheetService;

  /**
   * Retreives the profit/loss sheet.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} query
   * @returns {}
   */
  public sheet(tenantId: number, query: IProfitLossSheetQuery) {
    return this.profitLossSheet.profitLossSheet(tenantId, query);
  }

  /**
   * Retrieves the profit/loss sheet table format.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} query
   * @returns {Promise<IProfitLossSheetTable>}
   */
  public table(
    tenantId: number,
    query: IProfitLossSheetQuery
  ): Promise<IProfitLossSheetTable> {
    return this.profitLossTable.table(tenantId, query);
  }

  /**
   * Retrieves the profit/loss sheet in csv format.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} query
   * @returns {Promise<string>}
   */
  public csv(tenantId: number, query: IProfitLossSheetQuery): Promise<string> {
    return this.profitLossExport.csv(tenantId, query);
  }

  /**
   * Retrieves the profit/loss sheet in xlsx format.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(tenantId: number, query: IProfitLossSheetQuery): Promise<Buffer> {
    return this.profitLossExport.xlsx(tenantId, query);
  }
}
