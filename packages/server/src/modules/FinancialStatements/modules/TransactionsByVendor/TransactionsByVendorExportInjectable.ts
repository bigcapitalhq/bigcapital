import { Injectable } from '@nestjs/common';
import { ITransactionsByVendorsFilter } from './TransactionsByVendor.types';
import { TransactionsByVendorTableInjectable } from './TransactionsByVendorTableInjectable';
import { TableSheet } from '../../common/TableSheet';

@Injectable()
export class TransactionsByVendorExportInjectable {
  constructor(
    private readonly transactionsByVendorTable: TransactionsByVendorTableInjectable,
  ) {}

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {ITransactionsByVendorsFilter} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(
    query: ITransactionsByVendorsFilter
  ): Promise<Buffer> {
    const table = await this.transactionsByVendorTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<string>}
   */
  public async csv(
    query: ITransactionsByVendorsFilter
  ): Promise<string> {
    const table = await this.transactionsByVendorTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
