import * as R from 'ramda';
import { I18nService } from 'nestjs-i18n';
import {
  ICustomerBalanceSummaryData,
  ICustomerBalanceSummaryCustomer,
  ICustomerBalanceSummaryTotal,
  ICustomerBalanceSummaryQuery,
} from './CustomerBalanceSummary.types';
import {
  IColumnMapperMeta,
  ITableColumn,
  ITableRow,
} from '../../types/Table.types';
import { tableMapper, tableRowMapper } from '../../utils/Table.utils';

enum TABLE_ROWS_TYPES {
  CUSTOMER = 'CUSTOMER',
  TOTAL = 'TOTAL',
}

export class CustomerBalanceSummaryTable {
  public readonly report: ICustomerBalanceSummaryData;
  public readonly query: ICustomerBalanceSummaryQuery;
  public readonly i18n: I18nService;

  /**
   * Constructor method.
   * @param {ICustomerBalanceSummaryData} report - The report object.
   * @param {ICustomerBalanceSummaryQuery} query - The query object.
   * @param {I18nService} i18n - The i18n service.
   */
  constructor(
    report: ICustomerBalanceSummaryData,
    query: ICustomerBalanceSummaryQuery,
    i18n: I18nService,
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
      { key: 'name', accessor: 'customerName' },
      { key: 'total', accessor: 'total.formattedAmount' },
    ];
    return R.compose(
      R.concat(columns),
      R.when(
        R.always(this.query.percentageColumn),
        R.concat(this.getPercentageColumnsAccessor()),
      ),
    )([]);
  };

  /**
   * Transformes the customers to table rows.
   * @param   {ICustomerBalanceSummaryCustomer[]} customers
   * @returns {ITableRow[]}
   */
  private customersTransformer(
    customers: ICustomerBalanceSummaryCustomer[],
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
      { key: 'name', value: this.i18n.t('Total') },
      { key: 'total', accessor: 'total.formattedAmount' },
    ];
    return R.compose(
      R.concat(columns),
      R.when(
        R.always(this.query.percentageColumn),
        R.concat(this.getPercentageColumnsAccessor()),
      ),
    )([]);
  };

  /**
   * Transformes the total to table row.
   * @param {ICustomerBalanceSummaryTotal} total
   * @returns {ITableRow}
   */
  private totalTransformer = (
    total: ICustomerBalanceSummaryTotal,
  ): ITableRow => {
    const columns = this.getTotalColumnsAccessor();

    return tableRowMapper(total, columns, {
      rowTypes: [TABLE_ROWS_TYPES.TOTAL],
    });
  };

  /**
   * Transformes the customer balance summary to table rows.
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
        label: this.i18n.t('contact_summary_balance.account_name'),
      },
      { key: 'total', label: this.i18n.t('contact_summary_balance.total') },
    ];
    return R.compose(
      R.when(
        R.always(this.query.percentageColumn),
        R.append({
          key: 'percentage_of_column',
          label: this.i18n.t('contact_summary_balance.percentage_column'),
        }),
      ),
      R.concat(columns),
    )([]);
  };
}
