import * as R from 'ramda';
import { I18nService } from 'nestjs-i18n';
import {
  IVendorBalanceSummaryData,
  IVendorBalanceSummaryVendor,
  IVendorBalanceSummaryTotal,
  IVendorBalanceSummaryQuery,
} from './VendorBalanceSummary.types';
import {
  ITableRow,
  ITableColumn,
  IColumnMapperMeta,
} from '../../types/Table.types';
import { tableMapper, tableRowMapper } from '../../utils/Table.utils';

enum TABLE_ROWS_TYPES {
  VENDOR = 'VENDOR',
  TOTAL = 'TOTAL',
}

export class VendorBalanceSummaryTable {
  private readonly i18n: I18nService;
  private readonly report: IVendorBalanceSummaryData;
  private readonly query: IVendorBalanceSummaryQuery;

  /**
   * Constructor method.
   * @param {IVendorBalanceSummaryData} report - Report.
   * @param {IVendorBalanceSummaryQuery} query - Query.
   * @param {I18nService} i18n - I18n service.
   */
  constructor(
    report: IVendorBalanceSummaryData,
    query: IVendorBalanceSummaryQuery,
    i18n: I18nService
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
      { key: 'name', accessor: 'vendorName' },
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
   * Transformes the vendors to table rows.
   * @param {IVendorBalanceSummaryVendor[]} vendors
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
      { key: 'name', value: this.i18n.t('Total') },
      { key: 'total', accessor: 'total.formattedAmount' },
    ];
    return R.compose(
      R.concat(columns),
      R.when(
        R.always(this.query.percentageColumn),
        R.concat(this.getPercentageColumnsAccessor())
      )
    )([]) as IColumnMapperMeta[];
  };

  /**
   * Transformes the total to table row.
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
   * Transformes the vendor balance summary to table rows.
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
        label: this.i18n.t('contact_summary_balance.account_name'),
      },
      { key: 'total', label: this.i18n.t('contact_summary_balance.total') },
    ];
    return R.compose(
      R.when(
        () => this.query.percentageColumn,
        R.append({
          key: 'percentage_of_column',
          label: this.i18n.t('contact_summary_balance.percentage_column'),
        })
      ),
      R.concat(columns),
    )([]) as ITableColumn[];
  };
}
