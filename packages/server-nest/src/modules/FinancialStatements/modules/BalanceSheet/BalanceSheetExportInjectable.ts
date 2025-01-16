import { Injectable } from '@nestjs/common';
import { BalanceSheetTableInjectable } from './BalanceSheetTableInjectable';
import { BalanceSheetPdfInjectable } from './BalanceSheetPdfInjectable';
import { IBalanceSheetQuery } from './BalanceSheet.types';
import { TableSheet } from '../../common/TableSheet';

@Injectable()
export class BalanceSheetExportInjectable {
  constructor(
    private readonly balanceSheetTable: BalanceSheetTableInjectable,
    private readonly balanceSheetPdf: BalanceSheetPdfInjectable,
  ) {}

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IBalanceSheetQuery) {
    const table = await this.balanceSheetTable.table(query);

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
  public async csv(
    query: IBalanceSheetQuery,
  ): Promise<string> {
    const table = await this.balanceSheetTable.table(query);

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
  public async pdf(
    query: IBalanceSheetQuery,
  ): Promise<Buffer> {
    return this.balanceSheetPdf.pdf(query);
  }
}
