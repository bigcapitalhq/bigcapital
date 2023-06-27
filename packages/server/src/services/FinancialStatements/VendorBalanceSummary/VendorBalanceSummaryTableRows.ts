import * as R from 'ramda';
import { tableMapper, tableRowMapper } from 'utils';
import {
  IVendorBalanceSummaryData,
  IVendorBalanceSummaryVendor,
  IVendorBalanceSummaryTotal,
  ITableRow,
  IColumnMapperMeta,
  IVendorBalanceSummaryQuery,
  ITableColumn,
} from '@/interfaces';

enum TABLE_ROWS_TYPES {
  VENDOR = 'VENDOR',
  TOTAL = 'TOTAL',
}

export default class VendorBalanceSummaryTable {
  i18n: any;
  report: IVendorBalanceSummaryData;
  query: IVendorBalanceSummaryQuery;

  /**
   * Constructor method.
   * @param {IVendorBalanceSummaryData} report
   * @param i18n
   */
  constructor(
    report: IVendorBalanceSummaryData,
    query: IVendorBalanceSummaryQuery,
    i18n
  ) {
    this.report = report;
    this.query = query;
    this.i18n = i18n;
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
   * Retrieve vendor node columns accessor.
   * @returns {IColumnMapperMeta[]}
   */
  private getVendorColumnsAccessor = (): IColumnMapperMeta[] => {
    const columns = [
      { key: 'vendorName', accessor: 'vendorName' },
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
   * Transforms the vendors to table rows.
   * @param   {IVendorBalanceSummaryVendor[]} vendors
   * @returns {ITableRow[]}
   */
  private vendorsTransformer = (
    vendors: IVendorBalanceSummaryVendor[]
  ): ITableRow[] => {
    const columns = this.getVendorColumnsAccessor();

    return tableMapper(vendors, columns, {
      rowTypes: [TABLE_ROWS_TYPES.VENDOR],
    });
  };

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
   * @param   {IVendorBalanceSummaryTotal} total
   * @returns {ITableRow}
   */
  private totalTransformer = (total: IVendorBalanceSummaryTotal): ITableRow => {
    const columns = this.getTotalColumnsAccessor();

    return tableRowMapper(total, columns, {
      rowTypes: [TABLE_ROWS_TYPES.TOTAL],
    });
  };

  /**
   * Transforms the vendor balance summary to table rows.
   * @param {IVendorBalanceSummaryData} vendorBalanceSummary
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    const vendors = this.vendorsTransformer(this.report.vendors);
    const total = this.totalTransformer(this.report.total);

    return vendors.length > 0 ? [...vendors, total] : [];
  };

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
