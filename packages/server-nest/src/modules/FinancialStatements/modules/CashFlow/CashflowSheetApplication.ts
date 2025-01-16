import { Inject, Service } from 'typedi';
import { CashflowExportInjectable } from './CashflowExportInjectable';
import { ICashFlowStatementQuery } from '@/interfaces';
import CashFlowStatementService from './CashFlowService';
import { CashflowTableInjectable } from './CashflowTableInjectable';
import { CashflowTablePdfInjectable } from './CashflowTablePdfInjectable';

@Service()
export class CashflowSheetApplication {
  @Inject()
  private cashflowExport: CashflowExportInjectable;

  @Inject()
  private cashflowSheet: CashFlowStatementService;

  @Inject()
  private cashflowTable: CashflowTableInjectable;

  @Inject()
  private cashflowPdf: CashflowTablePdfInjectable;

  /**
   * Retrieves the cashflow sheet
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   */
  public async sheet(tenantId: number, query: ICashFlowStatementQuery) {
    return this.cashflowSheet.cashFlow(tenantId, query);
  }

  /**
   * Retrieves the cashflow sheet in table format.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   */
  public async table(tenantId: number, query: ICashFlowStatementQuery) {
    return this.cashflowTable.table(tenantId, query);
  }

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: ICashFlowStatementQuery) {
    return this.cashflowExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: ICashFlowStatementQuery
  ): Promise<string> {
    return this.cashflowExport.csv(tenantId, query);
  }

  /**
   * Retrieves the cashflow sheet in pdf format.
   * @param {number} tenantId 
   * @param {ICashFlowStatementQuery} query 
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: ICashFlowStatementQuery
  ): Promise<Buffer> {
    return this.cashflowPdf.pdf(tenantId, query);
  }
}
