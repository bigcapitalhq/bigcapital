import { Inject, Service } from 'typedi';
import { IBalanceSheetQuery } from '@/interfaces';
import { BalanceSheetExportInjectable } from './BalanceSheetExportInjectable';
import { BalanceSheetTableInjectable } from './BalanceSheetTableInjectable';
import BalanceSheetStatementService from './BalanceSheetInjectable';

@Service()
export class BalanceSheetApplication {
  @Inject()
  public balanceSheetExport: BalanceSheetExportInjectable;

  @Inject()
  public balanceSheetTable: BalanceSheetTableInjectable;

  @Inject()
  public balanceSheet: BalanceSheetStatementService;

  /**
   * Retrieves the balnace sheet in json format.
   * @param {numnber} tenantId
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<IBalanceSheetStatement>}
   */
  public sheet(tenantId: number, query: IBalanceSheetQuery) {
    return this.balanceSheet.balanceSheet(tenantId, query);
  }

  /**
   * Retrieves the balance sheet in table format.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<IBalanceSheetTable>}
   */
  public table(tenantId: number, query: IBalanceSheetQuery) {
    return this.balanceSheetTable.table(tenantId, query);
  }

  /**
   * Retrieves the balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(tenantId: number, query: IBalanceSheetQuery) {
    return this.balanceSheetExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the balance sheet in CSV format.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public csv(tenantId: number, query: IBalanceSheetQuery): Promise<string> {
    return this.balanceSheetExport.csv(tenantId, query);
  }

  /**
   * Retrieves the balance sheet in pdf format.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(tenantId: number, query: IBalanceSheetQuery) {
    return this.balanceSheetExport.pdf(tenantId, query);
  }
}
