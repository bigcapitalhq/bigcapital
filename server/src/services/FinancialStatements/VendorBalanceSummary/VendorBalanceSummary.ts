import * as R from 'ramda';
import {
  IJournalPoster,
  IVendor,
  IVendorBalanceSummaryVendor,
  IVendorBalanceSummaryQuery,
  IVendorBalanceSummaryData,
  IVendorBalanceSummaryTotal,
  INumberFormatQuery,
} from 'interfaces';
import { ContactBalanceSummaryReport } from '../ContactBalanceSummary/ContactBalanceSummary';

export class VendorBalanceSummaryReport extends ContactBalanceSummaryReport {
  readonly payableLedger: IJournalPoster;
  readonly baseCurrency: string;
  readonly vendors: IVendor[];
  readonly filter: IVendorBalanceSummaryQuery;
  readonly numberFormat: INumberFormatQuery;

  /**
   * Constructor method.
   * @param {IJournalPoster} receivableLedger
   * @param {IVendor[]} vendors
   * @param {IVendorBalanceSummaryQuery} filter
   * @param {string} baseCurrency
   */
  constructor(
    payableLedger: IJournalPoster,
    vendors: IVendor[],
    filter: IVendorBalanceSummaryQuery,
    baseCurrency: string
  ) {
    super();

    this.payableLedger = payableLedger;
    this.baseCurrency = baseCurrency;
    this.vendors = vendors;
    this.filter = filter;
    this.numberFormat = this.filter.numberFormat;
  }

  /**
   * Customer section mapper.
   * @param {IVendor} vendor
   * @returns {IVendorBalanceSummaryVendor}
   */
  private vendorMapper(vendor: IVendor): IVendorBalanceSummaryVendor {
    const balance = this.payableLedger.getContactBalance(null, vendor.id);

    return {
      vendorName: vendor.displayName,
      total: this.getContactTotalFormat(balance),
    };
  }

  /**
   * Mappes the vendor model object to vendor balance summary section.
   * @param {IVendor[]} vendors - Customers.
   * @returns {IVendorBalanceSummaryVendor[]}
   */
  private vendorsMapper(
    vendors: IVendor[]
  ): IVendorBalanceSummaryVendor[] {
    return vendors.map(this.vendorMapper.bind(this));
  }

  /**
   * Retrieve the vendors sections of the report.
   * @param {IVendor} vendors
   * @returns {IVendorBalanceSummaryVendor[]}
   */
  private getVendorsSection(
    vendors: IVendor[]
  ): IVendorBalanceSummaryVendor[] {
    return R.compose(
      R.when(
        R.always(this.filter.comparison.percentageOfColumn),
        this.contactCamparsionPercentageOfColumn.bind(this)
      ),
      this.vendorsMapper.bind(this)
    ).bind(this)(vendors);
  }

  /**
   * Retrieve the report statement data.
   * @returns {IVendorBalanceSummaryData}
   */
  public reportData(): IVendorBalanceSummaryData {
    const vendors = this.getVendorsSection(this.vendors);
    const total = this.getContactsTotalSection(vendors);

    return { vendors, total };
  }

  reportColumns() {
    return [];
  }
}
