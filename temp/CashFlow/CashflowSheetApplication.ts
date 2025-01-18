
import { CashflowExportInjectable } from './CashflowExportInjectable';
import { ICashFlowStatementQuery } from './Cashflow.types';
import { CashFlowStatementService } from './CashFlowService';
import { CashflowTableInjectable } from './CashflowTableInjectable';
import { CashflowTablePdfInjectable } from './CashflowTablePdfInjectable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CashflowSheetApplication {
  constructor(
    private readonly cashflowExport: CashflowExportInjectable,
    private readonly cashflowSheet: CashFlowStatementService,
    private readonly cashflowTable: CashflowTableInjectable,
    private readonly cashflowPdf: CashflowTablePdfInjectable,
  ) {}

  /**
   * Retrieves the cashflow sheet
   * @param {ICashFlowStatementQuery} query - Cashflow statement query.
   */
  public async sheet(query: ICashFlowStatementQuery) {
    return this.cashflowSheet.cashFlow(query);
  }

  /**
   * Retrieves the cashflow sheet in table format.
   * @param {ICashFlowStatementQuery} query - Cashflow statement query.
   */
  public async table(query: ICashFlowStatementQuery) {
    return this.cashflowTable.table(query);
  }

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {ICashFlowStatementQuery} query - Cashflow statement query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ICashFlowStatementQuery) {
    return this.cashflowExport.xlsx(query);
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {ICashFlowStatementQuery} query - Cashflow statement query.
   * @returns {Promise<Buffer>}
   */
  public async csv(query: ICashFlowStatementQuery): Promise<string> {
    return this.cashflowExport.csv(query);
  }

  /**
   * Retrieves the cashflow sheet in pdf format.
   * @param {ICashFlowStatementQuery} query - Cashflow statement query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: ICashFlowStatementQuery): Promise<Buffer> {
    return this.cashflowPdf.pdf(query);
  }
}
