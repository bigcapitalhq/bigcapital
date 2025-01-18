import { Injectable } from '@nestjs/common';
import { CashflowTableInjectable } from './CashflowTableInjectable';
import { ICashFlowStatementQuery } from './Cashflow.types';
import { TableSheet } from '../../common/TableSheet';

@Injectable()
export class CashflowExportInjectable {
  constructor(private readonly cashflowSheetTable: CashflowTableInjectable) {}

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {ICashFlowStatementQuery} query - Cashflow statement query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ICashFlowStatementQuery): Promise<Buffer> {
    const table = await this.cashflowSheetTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {ICashFlowStatementQuery} query - Cashflow statement query.
   * @returns {Promise<Buffer>}
   */
  public async csv(query: ICashFlowStatementQuery): Promise<string> {
    const table = await this.cashflowSheetTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
