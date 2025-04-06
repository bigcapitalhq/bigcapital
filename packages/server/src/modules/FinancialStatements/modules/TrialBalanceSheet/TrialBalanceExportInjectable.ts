import { TrialBalanceSheetTableInjectable } from './TrialBalanceSheetTableInjectable';
import { TrialBalanceSheetPdfInjectable } from './TrialBalanceSheetPdfInjectsable';
import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';
import { ITrialBalanceSheetQuery } from './TrialBalanceSheet.types';

@Injectable()
export class TrialBalanceExportInjectable {
  constructor(
    private readonly trialBalanceSheetTable: TrialBalanceSheetTableInjectable,
    private readonly trialBalanceSheetPdf: TrialBalanceSheetPdfInjectable,
  ) {}

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ITrialBalanceSheetQuery) {
    const table = await this.trialBalanceSheetTable.table(query);

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
  public async csv(query: ITrialBalanceSheetQuery): Promise<string> {
    const table = await this.trialBalanceSheetTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }

  /**
   * Retrieves the trial balance sheet in PDF format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: ITrialBalanceSheetQuery): Promise<Buffer> {
    return this.trialBalanceSheetPdf.pdf(query);
  }
}
