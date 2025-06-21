import { sum, isEmpty } from 'lodash';
import * as R from 'ramda';
import {
  IAPAgingSummaryData,
  IAPAgingSummaryVendor,
  IAPAgingSummaryColumns,
  IAPAgingSummaryTotal,
} from './APAgingSummary.types';
import { AgingSummaryReport } from '../AgingSummary/AgingSummary';
import { IAgingPeriod } from '../AgingSummary/AgingSummary.types';
import { ModelObject } from 'objection';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { allPassedConditionsPass } from '@/utils/all-conditions-passed';
import { APAgingSummaryRepository } from './APAgingSummaryRepository';
import { Bill } from '@/modules/Bills/models/Bill';
import { APAgingSummaryQueryDto } from './APAgingSummaryQuery.dto';

export class APAgingSummarySheet extends AgingSummaryReport {
  readonly repository: APAgingSummaryRepository;
  readonly query: APAgingSummaryQueryDto;
  readonly agingPeriods: IAgingPeriod[];

  readonly overdueInvoicesByContactId: Record<string, Array<ModelObject<Bill>>>;
  readonly currentInvoicesByContactId: Record<number, Array<ModelObject<Bill>>>;

  /**
   * Constructor method.
   * @param {APAgingSummaryQueryDto} query - Report query.
   * @param {APAgingSummaryRepository} repository - Repository
   */
  constructor(
    query: APAgingSummaryQueryDto,
    repository: APAgingSummaryRepository,
  ) {
    super();

    this.query = query;
    this.repository = repository;
    this.numberFormat = this.query.numberFormat;

    this.overdueInvoicesByContactId = this.repository.overdueBillsByVendorId;
    this.currentInvoicesByContactId = this.repository.dueBillsByVendorId;

    // Initializes the aging periods.
    this.agingPeriods = this.agingRangePeriods(
      this.query.asDate,
      this.query.agingDaysBefore,
      this.query.agingPeriods,
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
   * @param  {ModelObject<Vendor>} vendor
   * @return {IAPAgingSummaryVendor}
   */
  private vendorTransformer = (
    vendor: ModelObject<Vendor>,
  ): IAPAgingSummaryVendor => {
    const agingPeriods = this.getContactAgingPeriods(vendor.id);
    const currentTotal = this.getContactCurrentTotal(vendor.id);
    const agingPeriodsTotal = this.getAgingPeriodsTotal(agingPeriods);

    const amount = sum([agingPeriodsTotal, currentTotal]);

    return {
      vendorName: vendor.displayName,
      current: this.formatAmount(currentTotal),
      aging: agingPeriods,
      total: this.formatTotalAmount(amount),
    };
  };

  /**
   * Mappes the given vendor objects to vendor report node.
   * @param {ModelObject<Vendor>[]} vendors
   * @returns {IAPAgingSummaryVendor[]}
   */
  private vendorsMapper = (
    vendors: ModelObject<Vendor>[],
  ): IAPAgingSummaryVendor[] => {
    return vendors.map(this.vendorTransformer);
  };

  /**
   * Detarmines whether the given vendor node is none zero.
   * @param {IAPAgingSummaryVendor} vendorNode
   * @returns {boolean}
   */
  private filterNoneZeroVendorNode = (
    vendorNode: IAPAgingSummaryVendor,
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
   * Filtesr the given report vendors nodes.
   * @param {IAPAgingSummaryVendor[]} vendorNodes
   * @returns {IAPAgingSummaryVendor[]}
   */
  private vendorsFilter = (
    vendorNodes: IAPAgingSummaryVendor[],
  ): IAPAgingSummaryVendor[] => {
    return vendorNodes.filter(this.vendorNodeFilter);
  };

  /**
   * Detarmines whether vendors nodes filter enabled.
   * @returns {boolean}
   */
  private isVendorNodesFilter = (): boolean => {
    return isEmpty(this.query.vendorsIds);
  };

  /**
   * Retrieve vendors aging periods.
   * @return {IAPAgingSummaryVendor[]}
   */
  private vendorsSection = (
    vendors: ModelObject<Vendor>[],
  ): IAPAgingSummaryVendor[] => {
    return R.compose(
      R.when(this.isVendorNodesFilter, this.vendorsFilter),
      this.vendorsMapper,
    )(vendors);
  };

  /**
   * Retrieve the A/P aging summary report data.
   * @return {IAPAgingSummaryData}
   */
  public reportData = (): IAPAgingSummaryData => {
    const vendorsAgingPeriods = this.vendorsSection(this.repository.vendors);
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
