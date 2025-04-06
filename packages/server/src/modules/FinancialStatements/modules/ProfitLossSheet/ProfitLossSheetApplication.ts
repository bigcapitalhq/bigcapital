import { Injectable } from '@nestjs/common';
import { ProfitLossSheetExportInjectable } from './ProfitLossSheetExportInjectable';
import { ProfitLossSheetTableInjectable } from './ProfitLossSheetTableInjectable';
import {
  IProfitLossSheetQuery,
  IProfitLossSheetTable,
} from './ProfitLossSheet.types';
import { ProfitLossTablePdfInjectable } from './ProfitLossTablePdfInjectable';
import { ProfitLossSheetService } from './ProfitLossSheetService';

@Injectable()
export class ProfitLossSheetApplication {
  constructor(
    private readonly profitLossTable: ProfitLossSheetTableInjectable,
    private readonly profitLossExport: ProfitLossSheetExportInjectable,
    private readonly profitLossSheet: ProfitLossSheetService,
    private readonly profitLossPdf: ProfitLossTablePdfInjectable,
  ) {}

  /**
   * Retrieves the profit/loss sheet.
   * @param {IProfitLossSheetQuery} query
   * @returns {}
   */
  public sheet(query: IProfitLossSheetQuery) {
    return this.profitLossSheet.profitLossSheet(query);
  }

  /**
   * Retrieves the profit/loss sheet table format.
   * @param {IProfitLossSheetQuery} query - Profit/loss sheet query.
   * @returns {Promise<IProfitLossSheetTable>}
   */
  public table(query: IProfitLossSheetQuery): Promise<IProfitLossSheetTable> {
    return this.profitLossTable.table(query);
  }

  /**
   * Retrieves the profit/loss sheet in csv format.
   * @param {IProfitLossSheetQuery} query
   * @returns {Promise<string>}
   */
  public csv(query: IProfitLossSheetQuery): Promise<string> {
    return this.profitLossExport.csv(query);
  }

  /**
   * Retrieves the profit/loss sheet in xlsx format.
   * @param {IProfitLossSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: IProfitLossSheetQuery): Promise<Buffer> {
    return this.profitLossExport.xlsx(query);
  }

  /**
   * Retrieves the profit/loss sheet in pdf format.
   * @param {IProfitLossSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IProfitLossSheetQuery): Promise<Buffer> {
    return this.profitLossPdf.pdf(query);
  }
}
