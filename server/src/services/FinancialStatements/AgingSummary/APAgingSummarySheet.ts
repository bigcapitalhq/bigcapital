import { groupBy, sumBy } from 'lodash';
import AgingSummaryReport from './AgingSummary';
import {
  IAPAgingSummaryQuery,
  IAgingPeriod,
  IBill,
  IVendor,
  IAPAgingSummaryData,
  IAPAgingSummaryVendor,
  IAPAgingSummaryColumns
} from 'interfaces';
import { Dictionary } from 'tsyringe/dist/typings/types';
export default class APAgingSummarySheet extends AgingSummaryReport {
  readonly tenantId: number;
  readonly query: IAPAgingSummaryQuery;
  readonly contacts: IVendor[];
  readonly unpaidBills: IBill[];
  readonly baseCurrency: string;

  readonly unpaidInvoicesByContactId: Dictionary<IBill[]>;
  readonly agingPeriods: IAgingPeriod[];

  /**
   * Constructor method.
   * @param {number} tenantId - Tenant id.
   * @param {IAPAgingSummaryQuery} query - Report query.
   * @param {IVendor[]} vendors - Unpaid bills.
   * @param {string} baseCurrency - Base currency of the organization.
   */
  constructor(
    tenantId: number,
    query: IAPAgingSummaryQuery,
    vendors: IVendor[],
    unpaidBills: IBill[],
    baseCurrency: string
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.contacts = vendors;
    this.unpaidBills = unpaidBills;
    this.baseCurrency = baseCurrency;

    this.unpaidInvoicesByContactId = groupBy(unpaidBills, 'vendorId');

    // Initializes the aging periods.
    this.agingPeriods = this.agingRangePeriods(
      this.query.asDate,
      this.query.agingDaysBefore,
      this.query.agingPeriods
    );
  }

  /**
   * Retrieve the vendor section data.
   * @param  {IVendor} vendor
   * @return {IAPAgingSummaryVendor}
   */
  private vendorData(vendor: IVendor): IAPAgingSummaryVendor {
    const agingPeriods = this.getContactAgingPeriods(vendor.id);
    const amount = sumBy(agingPeriods, 'total');

    return {
      vendorName: vendor.displayName,
      aging: agingPeriods,
      total: this.formatTotalAmount(amount),
    };
  }

  /**
   * Retrieve vendors aging periods.
   * @return {IAPAgingSummaryVendor[]}
   */
  private vendorsWalker(vendors: IVendor[]): IAPAgingSummaryVendor[] {
    return vendors
      .map((vendor) => this.vendorData(vendor))
      .filter(
        (vendor: IAPAgingSummaryVendor) =>
          !(vendor.total.total === 0 && this.query.noneZero)
      );
  }

  /**
   * Retrieve the A/P aging summary report data.
   * @return {IAPAgingSummaryData}
   */
  public reportData(): IAPAgingSummaryData {
    const vendorsAgingPeriods = this.vendorsWalker(this.contacts);
    const totalAgingPeriods = this.getTotalAgingPeriods(vendorsAgingPeriods);

    return {
      vendors: vendorsAgingPeriods,
      total: totalAgingPeriods,
    }
  }

  /**
   * Retrieve the A/P aging summary report columns.
   */
  reportColumns(): IAPAgingSummaryColumns {
    return this.agingPeriods;
  }
}