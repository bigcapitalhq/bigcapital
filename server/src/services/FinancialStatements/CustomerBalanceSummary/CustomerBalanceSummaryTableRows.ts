import { get } from 'lodash';
import {
  ICustomerBalanceSummaryData,
  ICustomerBalanceSummaryCustomer,
  ICustomerBalanceSummaryTotal,
} from 'interfaces';
import { Service } from 'typedi';

interface IColumnMapperMeta {
  key: string;
  accessor?: string;
  value?: string;
}

interface ITableCell {
  value: string;
  key: string;
}

type ITableRow = {
  rows: ITableCell[];
};

enum TABLE_ROWS_TYPES {
  CUSTOMER = 'CUSTOMER',
  TOTAL = 'TOTAL',
}

function tableMapper(
  data: Object[],
  columns: IColumnMapperMeta[],
  rowsMeta
): ITableRow[] {
  return data.map((object) => tableRowMapper(object, columns, rowsMeta));
}

function tableRowMapper(
  object: Object,
  columns: IColumnMapperMeta[],
  rowMeta
): ITableRow {
  const cells = columns.map((column) => ({
    key: column.key,
    value: column.value ? column.value : get(object, column.accessor),
  }));

  return {
    cells,
    ...rowMeta,
  };
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
    return [
      ...this.customersTransformer(customerBalanceSummary.customers),
      this.totalTransformer(customerBalanceSummary.total),
    ];
  }
}
