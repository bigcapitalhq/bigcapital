import { TrialBalanceSheetTableInjectable } from './TrialBalanceSheetTableInjectable';
import { TrialBalanceExportInjectable } from './TrialBalanceExportInjectable';
import { ITrialBalanceSheetQuery, ITrialBalanceStatement } from './TrialBalanceSheet.types';
import { TrialBalanceSheetService } from './TrialBalanceSheetInjectable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrialBalanceSheetApplication {
  /**
   * @param {TrialBalanceSheetService} sheetService - The trial balance sheet service.
   * @param {TrialBalanceSheetTableInjectable} tablable - The trial balance sheet table injectable.
   * @param {TrialBalanceExportInjectable} exportable - The trial balance export injectable.
   */
  constructor(
    private readonly sheetService: TrialBalanceSheetService,
    private readonly tablable: TrialBalanceSheetTableInjectable,
    private readonly exportable: TrialBalanceExportInjectable,
  ) {}

  /**
   * Retrieves the trial balance sheet.
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<ITrialBalanceStatement>}
   */
  public sheet(
    query: ITrialBalanceSheetQuery,
  ): Promise<ITrialBalanceStatement> {
    return this.sheetService.trialBalanceSheet(query);
  }

  /**
   * Retrieves the trial balance sheet in table format.
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<ITrialBalanceSheetTable>}
   */
  public table(query: ITrialBalanceSheetQuery) {
    return this.tablable.table(query);
  }

  /**
   * Retrieve the trial balance sheet in CSV format.
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public csv(query: ITrialBalanceSheetQuery) {
    return this.exportable.csv(query);
  }

  /**
   * Retrieve the trial balance sheet in XLSX format.
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ITrialBalanceSheetQuery) {
    return this.exportable.xlsx(query);
  }

  /**
   * Retrieve the trial balance sheet in pdf format.
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: ITrialBalanceSheetQuery) {
    return this.exportable.pdf(query);
  }
}
