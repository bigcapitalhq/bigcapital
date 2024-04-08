import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { Inject, Service } from 'typedi';
import { IBalanceSheetQuery } from '../../../interfaces/BalanceSheet';
import { BalanceSheetPdfInjectable } from './BalanceSheetPdfInjectable';
import { BalanceSheetTableInjectable } from './BalanceSheetTableInjectable';

@Service()
export class BalanceSheetExportInjectable {
  @Inject()
  private balanceSheetTable: BalanceSheetTableInjectable;

  @Inject()
  private balanceSheetPdf: BalanceSheetPdfInjectable;

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: IBalanceSheetQuery) {
    const table = await this.balanceSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(tenantId: number, query: IBalanceSheetQuery): Promise<string> {
    const table = await this.balanceSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }

  /**
   * Retrieves the balance sheet in pdf format.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async pdf(tenantId: number, query: IBalanceSheetQuery): Promise<Buffer> {
    return this.balanceSheetPdf.pdf(tenantId, query);
  }
}
