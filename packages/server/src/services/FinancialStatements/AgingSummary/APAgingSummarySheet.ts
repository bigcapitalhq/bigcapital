import { groupBy, sum, isEmpty } from 'lodash';
import * as R from 'ramda';
import AgingSummaryReport from './AgingSummary';
import {
  IAPAgingSummaryQuery,
  IAgingPeriod,
  IBill,
  IVendor,
  IAPAgingSummaryData,
  IAPAgingSummaryVendor,
  IAPAgingSummaryColumns,
  IAPAgingSummaryTotal,
} from '@/interfaces';
import { Dictionary } from 'tsyringe/dist/typings/types';
import { allPassedConditionsPass } from 'utils';

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
  private getVendorsTotal = (vendorsAgingPeriods): IAPAgingSummaryTotal => {
    const totalAgingPeriods = this.getTotalAgingPeriods(vendorsAgingPeriods);
    const totalCurrent = this.getTotalCurrent(vendorsAgingPeriods);
    const totalVendorsTotal = this.getTotalContactsTotals(vendorsAgingPeriods);

    return {
      current: this.formatTotalAmount(totalCurrent),
      aging: totalAgingPeriods,
      total: this.formatTotalAmount(totalVendorsTotal),
    };
  };

  /**
   * Retrieve the vendor section data.
   * @param  {IVendor} vendor
   * @return {IAPAgingSummaryVendor}
   */
  private vendorTransformer = (vendor: IVendor): IAPAgingSummaryVendor => {
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
  };

  /**
   * Maps the given vendor objects to vendor report node.
   * @param {IVendor[]} vendors
   * @returns {IAPAgingSummaryVendor[]}
   */
  private vendorsMapper = (vendors: IVendor[]): IAPAgingSummaryVendor[] => {
    return vendors.map(this.vendorTransformer);
  };

  /**
   * Determines whether the given vendor node is none zero.
   * @param {IAPAgingSummaryVendor} vendorNode
   * @returns {boolean}
   */
  private filterNoneZeroVendorNode = (
    vendorNode: IAPAgingSummaryVendor
  ): boolean => {
    return vendorNode.total.amount !== 0;
  };

  /**
   * Filters vendors report nodes based on the given report query.
   * @param {IAPAgingSummaryVendor} vendorNode
   * @returns {boolean}
   */
  private vendorNodeFilter = (vendorNode: IAPAgingSummaryVendor): boolean => {
    const { noneZero } = this.query;

    const conditions = [[noneZero, this.filterNoneZeroVendorNode]];

    return allPassedConditionsPass(conditions)(vendorNode);
  };

  /**
   * Filter the given report vendors nodes.
   * @param {IAPAgingSummaryVendor[]} vendorNodes
   * @returns {IAPAgingSummaryVendor[]}
   */
  private vendorsFilter = (
    vendorNodes: IAPAgingSummaryVendor[]
  ): IAPAgingSummaryVendor[] => {
    return vendorNodes.filter(this.vendorNodeFilter);
  };

  /**
   * Determines whether vendors nodes filter enabled.
   * @returns {boolean}
   */
  private isVendorNodesFilter = (): boolean => {
    return isEmpty(this.query.vendorsIds);
  };

  /**
   * Retrieve vendors aging periods.
   * @return {IAPAgingSummaryVendor[]}
   */
  private vendorsSection = (vendors: IVendor[]): IAPAgingSummaryVendor[] => {
    return R.compose(
      R.when(this.isVendorNodesFilter, this.vendorsFilter),
      this.vendorsMapper
    )(vendors);
  };

  /**
   * Retrieve the A/P aging summary report data.
   * @return {IAPAgingSummaryData}
   */
  public reportData = (): IAPAgingSummaryData => {
    const vendorsAgingPeriods = this.vendorsSection(this.contacts);
    const vendorsTotal = this.getVendorsTotal(vendorsAgingPeriods);

    return {
      vendors: vendorsAgingPeriods,
      total: vendorsTotal,
    };
  };

  /**
   * Retrieve the A/P aging summary report columns.
   */
  public reportColumns = (): IAPAgingSummaryColumns => {
    return this.agingPeriods;
  };
}
