import { Injectable } from '@nestjs/common';
import { IBalanceSheetQuery } from './BalanceSheet.types';
import { BalanceSheetExportInjectable } from './BalanceSheetExportInjectable';
import { BalanceSheetTableInjectable } from './BalanceSheetTableInjectable';
import { BalanceSheetInjectable } from './BalanceSheetInjectable';

@Injectable()
export class BalanceSheetApplication {
  /**
   * @param {BalanceSheetExportInjectable} balanceSheetExportService - The balance sheet export service.
   * @param {BalanceSheetTableInjectable} balanceSheetTableService - The balance sheet table service.
   * @param {BalanceSheetInjectable} balanceSheetService - The balance sheet service.
   */
  constructor(
    private readonly balanceSheetExportService: BalanceSheetExportInjectable,
    private readonly balanceSheetTableService: BalanceSheetTableInjectable,
    private readonly balanceSheetService: BalanceSheetInjectable,
  ) {}

  /**
   * Retrieves the balnace sheet in json format.
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<IBalanceSheetStatement>}
   */
  public sheet(query: IBalanceSheetQuery) {
    return this.balanceSheetService.balanceSheet(query);
  }

  /**
   * Retrieves the balance sheet in table format.
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<IBalanceSheetTable>}
   */
  public table(query: IBalanceSheetQuery) {
    return this.balanceSheetTableService.table(query);
  }

  /**
   * Retrieves the balance sheet in XLSX format.
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: IBalanceSheetQuery) {
    return this.balanceSheetExportService.xlsx(query);
  }

  /**
   * Retrieves the balance sheet in CSV format.
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public csv(query: IBalanceSheetQuery): Promise<string> {
    return this.balanceSheetExportService.csv(query);
  }

  /**
   * Retrieves the balance sheet in pdf format.
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IBalanceSheetQuery) {
    return this.balanceSheetExportService.pdf(query);
  }
}
