import * as R from 'ramda';
import {
  ICustomerBalanceSummaryData,
  ICustomerBalanceSummaryCustomer,
  ICustomerBalanceSummaryTotal,
  ITableRow,
  IColumnMapperMeta,
  ICustomerBalanceSummaryQuery,
  ITableColumn,
} from '@/interfaces';
import { tableMapper, tableRowMapper } from 'utils';

enum TABLE_ROWS_TYPES {
  CUSTOMER = 'CUSTOMER',
  TOTAL = 'TOTAL',
}

export default class CustomerBalanceSummaryTable {
  report: ICustomerBalanceSummaryData;
  query: ICustomerBalanceSummaryQuery;
  i18n: any;

  /**
   * Constructor method.
   */
  constructor(
    report: ICustomerBalanceSummaryData,
    query: ICustomerBalanceSummaryQuery,
    i18n
  ) {
    this.report = report;
    this.i18n = i18n;
    this.query = query;
  }

  /**
   * Retrieve percentage columns accessor.
   * @returns {IColumnMapperMeta[]}
   */
  private getPercentageColumnsAccessor = (): IColumnMapperMeta[] => {
    return [
      {
        key: 'percentageOfColumn',
        accessor: 'percentageOfColumn.formattedAmount',
      },
    ];
  };

  /**
   * Retrieve customer node columns accessor.
   * @returns {IColumnMapperMeta[]}
   */
  private getCustomerColumnsAccessor = (): IColumnMapperMeta[] => {
    const columns = [
      { key: 'customerName', accessor: 'customerName' },
      { key: 'total', accessor: 'total.formattedAmount' },
    ];
    return R.compose(
      R.concat(columns),
      R.when(
        R.always(this.query.percentageColumn),
        R.concat(this.getPercentageColumnsAccessor())
      )
    )([]);
  };

  /**
   * Transforms the customers to table rows.
   * @param   {ICustomerBalanceSummaryCustomer[]} customers
   * @returns {ITableRow[]}
   */
  private customersTransformer(
    customers: ICustomerBalanceSummaryCustomer[]
  ): ITableRow[] {
    const columns = this.getCustomerColumnsAccessor();

    return tableMapper(customers, columns, {
      rowTypes: [TABLE_ROWS_TYPES.CUSTOMER],
    });
  }

  /**
   * Retrieve total node columns accessor.
   * @returns {IColumnMapperMeta[]}
   */
  private getTotalColumnsAccessor = (): IColumnMapperMeta[] => {
    const columns = [
      { key: 'total', value: this.i18n.__('Total') },
      { key: 'total', accessor: 'total.formattedAmount' },
    ];
    return R.compose(
      R.concat(columns),
      R.when(
        R.always(this.query.percentageColumn),
        R.concat(this.getPercentageColumnsAccessor())
      )
    )([]);
  };

  /**
   * Transforms the total to table row.
   * @param   {ICustomerBalanceSummaryTotal} total
   * @returns {ITableRow}
   */
  private totalTransformer = (
    total: ICustomerBalanceSummaryTotal
  ): ITableRow => {
    const columns = this.getTotalColumnsAccessor();

    return tableRowMapper(total, columns, {
      rowTypes: [TABLE_ROWS_TYPES.TOTAL],
    });
  };

  /**
   * Transforms the customer balance summary to table rows.
   * @param   {ICustomerBalanceSummaryData} customerBalanceSummary
   * @returns {ITableRow[]}
   */
  public tableRows(): ITableRow[] {
    const customers = this.customersTransformer(this.report.customers);
    const total = this.totalTransformer(this.report.total);

    return customers.length > 0 ? [...customers, total] : [];
  }

  /**
   * Retrieve the report statement columns
   * @returns {ITableColumn[]}
   */
   public tableColumns = (): ITableColumn[] => {
    const columns = [
      {
        key: 'name',
        label: this.i18n.__('contact_summary_balance.account_name'),
      },
      { key: 'total', label: this.i18n.__('contact_summary_balance.total') },
    ];
    return R.compose(
      R.when(
        R.always(this.query.percentageColumn),
        R.append({
          key: 'percentage_of_column',
          label: this.i18n.__('contact_summary_balance.percentage_column'),
        })
      ),
      R.concat(columns)
    )([]);
  };
}
