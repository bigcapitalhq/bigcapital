import { Inject, Service } from 'typedi';
import { TrialBalanceSheetTableInjectable } from './TrialBalanceSheetTableInjectable';
import { TrialBalanceExportInjectable } from './TrialBalanceExportInjectable';
import { ITrialBalanceSheetQuery, ITrialBalanceStatement } from '@/interfaces';
import TrialBalanceSheetService from './TrialBalanceSheetInjectable';

@Service()
export class TrialBalanceSheetApplication {
  @Inject()
  private sheetService: TrialBalanceSheetService;

  @Inject()
  private tablable: TrialBalanceSheetTableInjectable;

  @Inject()
  private exportable: TrialBalanceExportInjectable;

  /**
   * Retrieves the trial balance sheet.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<ITrialBalanceStatement>}
   */
  public sheet(
    tenantId: number,
    query: ITrialBalanceSheetQuery
  ): Promise<ITrialBalanceStatement> {
    return this.sheetService.trialBalanceSheet(tenantId, query);
  }

  /**
   * Retrieves the trial balance sheet in table format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<ITrialBalanceSheetTable>}
   */
  public table(tenantId: number, query: ITrialBalanceSheetQuery) {
    return this.tablable.table(tenantId, query);
  }

  /**
   * Retrieve the trial balance sheet in CSV format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public csv(tenantId: number, query: ITrialBalanceSheetQuery) {
    return this.exportable.csv(tenantId, query);
  }

  /**
   * Retrieve the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: ITrialBalanceSheetQuery) {
    return this.exportable.xlsx(tenantId, query);
  }

  /**
   * Retrieve the trial balance sheet in pdf format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async pdf(tenantId: number, query: ITrialBalanceSheetQuery) {
    return this.exportable.pdf(tenantId, query);
  }
}
