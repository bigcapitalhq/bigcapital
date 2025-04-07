import { Injectable } from '@nestjs/common';
import { ICustomerBalanceSummaryQuery } from './CustomerBalanceSummary.types';
import { CustomerBalanceSummaryTableInjectable } from './CustomerBalanceSummaryTableInjectable';
import { TableSheet } from '../../common/TableSheet';

@Injectable()
export class CustomerBalanceSummaryExportInjectable {
  /**
   * Constructor method.
   * @param {CustomerBalanceSummaryTableInjectable} customerBalanceSummaryTable
   */
  constructor(
    private readonly customerBalanceSummaryTable: CustomerBalanceSummaryTableInjectable,
  ) {}

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ICustomerBalanceSummaryQuery) {
    const table = await this.customerBalanceSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {ICustomerBalanceSummaryQuery} query - Query.
   * @returns {Promise<Buffer>}
   */
  public async csv(query: ICustomerBalanceSummaryQuery): Promise<string> {
    const table = await this.customerBalanceSummaryTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
