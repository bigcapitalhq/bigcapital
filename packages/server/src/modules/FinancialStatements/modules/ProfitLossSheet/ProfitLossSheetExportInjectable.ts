import { Injectable } from '@nestjs/common';

import { TableSheet } from '../../common/TableSheet';
import { IProfitLossSheetQuery } from './ProfitLossSheet.types';
import { ProfitLossSheetTableInjectable } from './ProfitLossSheetTableInjectable';

@Injectable()
export class ProfitLossSheetExportInjectable {
  constructor(
    private readonly profitLossSheetTable: ProfitLossSheetTableInjectable,
  ) {}

  /**
   * Retrieves the profit/loss sheet in XLSX format.
   * @param {IProfitLossSheetQuery} query - The profit/loss sheet query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IProfitLossSheetQuery) {
    const table = await this.profitLossSheetTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the profit/loss sheet in CSV format.
   * @param {IProfitLossSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(query: IProfitLossSheetQuery): Promise<string> {
    const table = await this.profitLossSheetTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
