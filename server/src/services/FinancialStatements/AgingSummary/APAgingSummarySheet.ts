import { groupBy, sum } from 'lodash';
import AgingSummaryReport from './AgingSummary';
import {
  IAPAgingSummaryQuery,
  IAgingPeriod,
  IBill,
  IVendor,
  IAPAgingSummaryData,
  IAPAgingSummaryVendor,
  IAPAgingSummaryColumns,
  IAPAgingSummaryTotal
} from 'interfaces';
import { Dictionary } from 'tsyringe/dist/typings/types';

export default class APAgingSummarySheet extends AgingSummaryReport {
  readonly tenantId: number;
  readonly query: IAPAgingSummaryQuery;
  readonly contacts: IVendor[];
  readonly unpaidBills: IBill[];
  readonly baseCurrency: string;

  readonly overdueInvoicesByContactId: Dictionary<IBill[]>;
  readonly currentInvoicesByContactId: Dictionary<IBill[]>;

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
    overdueBills: IBill[],
    unpaidBills: IBill[],
    baseCurrency: string
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.contacts = vendors;
    this.baseCurrency = baseCurrency;

    this.overdueInvoicesByContactId = groupBy(overdueBills, 'vendorId');
    this.currentInvoicesByContactId = groupBy(unpaidBills, 'vendorId');

    // Initializes the aging periods.
    this.agingPeriods = this.agingRangePeriods(
      this.query.asDate,
      this.query.agingDaysBefore,
      this.query.agingPeriods
    );
  }

  /**
   * Retrieve the vendors aging and current total.
   * @param  {IAPAgingSummaryTotal} vendorsAgingPeriods 
   * @return {IAPAgingSummaryTotal}
   */
  getVendorsTotal(vendorsAgingPeriods): IAPAgingSummaryTotal {
    const totalAgingPeriods = this.getTotalAgingPeriods(vendorsAgingPeriods);
    const totalCurrent = this.getTotalCurrent(vendorsAgingPeriods);
    const totalVendorsTotal = this.getTotalContactsTotals(vendorsAgingPeriods);

    return {
      current: this.formatTotalAmount(totalCurrent),
      aging: totalAgingPeriods,
      total: this.formatTotalAmount(totalVendorsTotal),
    };
  }

  /**
   * Retrieve the vendor section data.
   * @param  {IVendor} vendor
   * @return {IAPAgingSummaryVendor}
   */
  private vendorData(vendor: IVendor): IAPAgingSummaryVendor {
    const agingPeriods = this.getContactAgingPeriods(vendor.id);
    const currentTotal = this.getContactCurrentTotal(vendor.id);
    const agingPeriodsTotal = this.getAgingPeriodsTotal(agingPeriods);

    const amount = sum([agingPeriodsTotal, currentTotal]);

    return {
      vendorName: vendor.displayName,
      current: this.formatTotalAmount(currentTotal),
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
          !(vendor.total.amount === 0 && this.query.noneZero)
      );
  }

  /**
   * Retrieve the A/P aging summary report data.
   * @return {IAPAgingSummaryData}
   */
  public reportData(): IAPAgingSummaryData {
    const vendorsAgingPeriods = this.vendorsWalker(this.contacts);
    const vendorsTotal = this.getVendorsTotal(vendorsAgingPeriods);

    return {
      vendors: vendorsAgingPeriods,
      total: vendorsTotal,
    };
  }

  /**
   * Retrieve the A/P aging summary report columns.
   */
  public reportColumns(): IAPAgingSummaryColumns {
    return this.agingPeriods;
  }
}
