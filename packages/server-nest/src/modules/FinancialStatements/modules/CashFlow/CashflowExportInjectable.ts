import { Inject, Service } from 'typedi';
import { ICashFlowStatementQuery } from '@/interfaces';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { CashflowTableInjectable } from './CashflowTableInjectable';

@Service()
export class CashflowExportInjectable {
  @Inject()
  private cashflowSheetTable: CashflowTableInjectable;

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(
    tenantId: number,
    query: ICashFlowStatementQuery
  ): Promise<Buffer> {
    const table = await this.cashflowSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
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
    const table = await this.cashflowSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
