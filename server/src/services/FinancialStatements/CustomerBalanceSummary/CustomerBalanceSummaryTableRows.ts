import { Service } from 'typedi';
import {
  ICustomerBalanceSummaryData,
  ICustomerBalanceSummaryCustomer,
  ICustomerBalanceSummaryTotal,
  ITableRow,
} from 'interfaces';
import { tableMapper, tableRowMapper } from 'utils';

enum TABLE_ROWS_TYPES {
  CUSTOMER = 'CUSTOMER',
  TOTAL = 'TOTAL',
}

@Service()
export default class CustomerBalanceSummaryTableRows {
  /**
   * Transformes the customers to table rows.
   * @param {ICustomerBalanceSummaryCustomer[]} customers
   * @returns {ITableRow[]}
   */
  private customersTransformer(
    customers: ICustomerBalanceSummaryCustomer[]
  ): ITableRow[] {
    const columns = [
      { key: 'customerName', accessor: 'customerName' },
      { key: 'total', accessor: 'total.formattedAmount' },
      {
        key: 'percentageOfColumn',
        accessor: 'percentageOfColumn.formattedAmount',
      },
    ];
    return tableMapper(customers, columns, {
      rowTypes: [TABLE_ROWS_TYPES.CUSTOMER],
    });
  }

  /**
   * Transformes the total to table row.
   * @param {ICustomerBalanceSummaryTotal} total
   * @returns {ITableRow}
   */
  private totalTransformer(total: ICustomerBalanceSummaryTotal) {
    const columns = [
      { key: 'total', value: 'Total' },
      { key: 'total', accessor: 'total.formattedAmount' },
      {
        key: 'percentageOfColumn',
        accessor: 'percentageOfColumn.formattedAmount',
      },
    ];
    return tableRowMapper(total, columns, {
      rowTypes: [TABLE_ROWS_TYPES.TOTAL],
    });
  }

  /**
   * Transformes the customer balance summary to table rows.
   * @param {ICustomerBalanceSummaryData} customerBalanceSummary
   * @returns {ITableRow[]}
   */
  public tableRowsTransformer(
    customerBalanceSummary: ICustomerBalanceSummaryData
  ): ITableRow[] {
    const customers = this.customersTransformer(
      customerBalanceSummary.customers
    );
    const total = this.totalTransformer(customerBalanceSummary.total);

    return customers.length > 0 ? [...customers, total] : [];
  }
}
