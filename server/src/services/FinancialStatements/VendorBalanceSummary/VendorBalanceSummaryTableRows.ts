import { Service } from 'typedi';
import { tableMapper, tableRowMapper } from 'utils';
import {
  IVendorBalanceSummaryData,
  IVendorBalanceSummaryVendor,
  IVendorBalanceSummaryTotal,
  ITableRow,
} from 'interfaces';

enum TABLE_ROWS_TYPES {
  VENDOR = 'VENDOR',
  TOTAL = 'TOTAL',
}

@Service()
export default class VendorBalanceSummaryTableRows {
  /**
   * Transformes the vendors to table rows.
   * @param {IVendorBalanceSummaryVendor[]} vendors
   * @returns {ITableRow[]}
   */
  private vendorsTransformer(
    vendors: IVendorBalanceSummaryVendor[]
  ): ITableRow[] {
    const columns = [
      { key: 'vendorName', accessor: 'vendorName' },
      { key: 'total', accessor: 'total.formattedAmount' },
      {
        key: 'percentageOfColumn',
        accessor: 'percentageOfColumn.formattedAmount',
      },
    ];
    return tableMapper(vendors, columns, {
      rowTypes: [TABLE_ROWS_TYPES.VENDOR],
    });
  }

  /**
   * Transformes the total to table row.
   * @param {IVendorBalanceSummaryTotal} total
   * @returns {ITableRow}
   */
  private totalTransformer(total: IVendorBalanceSummaryTotal) {
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
   * Transformes the vendor balance summary to table rows.
   * @param {IVendorBalanceSummaryData} vendorBalanceSummary
   * @returns {ITableRow[]}
   */
  public tableRowsTransformer(
    vendorBalanceSummary: IVendorBalanceSummaryData
  ): ITableRow[] {
    const vendors = this.vendorsTransformer(vendorBalanceSummary.vendors);
    const total = this.totalTransformer(vendorBalanceSummary.total);

    return vendors.length > 0 ? [...vendors, total] : [];
  }
}
