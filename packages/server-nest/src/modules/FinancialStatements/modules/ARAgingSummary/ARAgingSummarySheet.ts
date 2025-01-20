import * as R from 'ramda';
import { Dictionary, groupBy, isEmpty, sum } from 'lodash';
import { IAgingPeriod } from '../AgingSummary/AgingSummary.types';
import {
  IARAgingSummaryQuery,
  IARAgingSummaryCustomer,
  IARAgingSummaryData,
  IARAgingSummaryColumns,
  IARAgingSummaryTotal,
} from './ARAgingSummary.types';
import { AgingSummaryReport } from '../AgingSummary/AgingSummary';
import { allPassedConditionsPass } from '@/utils/all-conditions-passed';
import { ModelObject } from 'objection';
import { Customer } from '@/modules/Customers/models/Customer';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';

export class ARAgingSummarySheet extends AgingSummaryReport {
  readonly tenantId: number;
  readonly query: IARAgingSummaryQuery;
  readonly contacts: ModelObject<Customer>[];
  readonly agingPeriods: IAgingPeriod[];
  readonly baseCurrency: string;

  readonly overdueInvoicesByContactId: Dictionary<ModelObject<SaleInvoice>[]>;
  readonly currentInvoicesByContactId: Dictionary<ModelObject<SaleInvoice>[]>;

  /**
   * Constructor method.
   * @param {number} tenantId
   * @param {IARAgingSummaryQuery} query
   * @param {ICustomer[]} customers
   * @param {IJournalPoster} journal
   */
  constructor(
    tenantId: number,
    query: IARAgingSummaryQuery,
    customers: ModelObject<Customer>[],
    overdueSaleInvoices: ModelObject<SaleInvoice>[],
    currentSaleInvoices: ModelObject<SaleInvoice>[],
    baseCurrency: string,
  ) {
    super();

    this.tenantId = tenantId;
    this.contacts = customers;
    this.query = query;
    this.baseCurrency = baseCurrency;
    this.numberFormat = this.query.numberFormat;

    this.overdueInvoicesByContactId = groupBy(
      overdueSaleInvoices,
      'customerId',
    );
    this.currentInvoicesByContactId = groupBy(
      currentSaleInvoices,
      'customerId',
    );
    // Initializes the aging periods.
    this.agingPeriods = this.agingRangePeriods(
      this.query.asDate,
      this.query.agingDaysBefore,
      this.query.agingPeriods,
    );
  }

  /**
   * Mapping aging customer.
   * @param {ICustomer} customer -
   * @return {IARAgingSummaryCustomer[]}
   */
  private customerTransformer = (
    customer: ModelObject<Customer>,
  ): IARAgingSummaryCustomer => {
    const agingPeriods = this.getContactAgingPeriods(customer.id);
    const currentTotal = this.getContactCurrentTotal(customer.id);
    const agingPeriodsTotal = this.getAgingPeriodsTotal(agingPeriods);
    const amount = sum([agingPeriodsTotal, currentTotal]);

    return {
      customerName: customer.displayName,
      current: this.formatAmount(currentTotal),
      aging: agingPeriods,
      total: this.formatTotalAmount(amount),
    };
  };

  /**
   * Mappes the customers objects to report accounts nodes.
   * @param {ICustomer[]} customers
   * @returns {IARAgingSummaryCustomer[]}
   */
  private customersMapper = (
    customers: ModelObject<Customer>[],
  ): IARAgingSummaryCustomer[] => {
    return customers.map(this.customerTransformer);
  };

  /**
   * Filters the none-zero account report node.
   * @param {IARAgingSummaryCustomer} node
   * @returns {boolean}
   */
  private filterNoneZeroAccountNode = (
    node: IARAgingSummaryCustomer,
  ): boolean => {
    return node.total.amount !== 0;
  };

  /**
   * Filters customer report node based on the given report query.
   * @param {IARAgingSummaryCustomer} customerNode
   * @returns {boolean}
   */
  private customerNodeFilter = (
    customerNode: IARAgingSummaryCustomer,
  ): boolean => {
    const { noneZero } = this.query;

    const conditions = [[noneZero, this.filterNoneZeroAccountNode]];

    return allPassedConditionsPass(conditions)(customerNode);
  };

  /**
   * Filters customers report nodes.
   * @param {IARAgingSummaryCustomer[]} customers
   * @returns {IARAgingSummaryCustomer[]}
   */
  private customersFilter = (
    customers: IARAgingSummaryCustomer[],
  ): IARAgingSummaryCustomer[] => {
    return customers.filter(this.customerNodeFilter);
  };

  /**
   * Detarmines the customers nodes filter is enabled.
   * @returns {boolean}
   */
  private isCustomersFilterEnabled = (): boolean => {
    return isEmpty(this.query.customersIds);
  };

  /**
   * Retrieve customers report.
   * @param {ICustomer[]} customers
   * @return {IARAgingSummaryCustomer[]}
   */
  private customersWalker = (
    customers: ModelObject<Customer>[],
  ): IARAgingSummaryCustomer[] => {
    return R.compose(
      R.when(this.isCustomersFilterEnabled, this.customersFilter),
      this.customersMapper,
    )(customers);
  };

  /**
   * Retrieve the customers aging and current total.
   * @param {IARAgingSummaryCustomer} customersAgingPeriods
   */
  private getCustomersTotal = (
    customersAgingPeriods: IARAgingSummaryCustomer[],
  ): IARAgingSummaryTotal => {
    const totalAgingPeriods = this.getTotalAgingPeriods(customersAgingPeriods);
    const totalCurrent = this.getTotalCurrent(customersAgingPeriods);
    const totalCustomersTotal = this.getTotalContactsTotals(
      customersAgingPeriods,
    );

    return {
      current: this.formatTotalAmount(totalCurrent),
      aging: totalAgingPeriods,
      total: this.formatTotalAmount(totalCustomersTotal),
    };
  };

  /**
   * Retrieve A/R aging summary report data.
   * @return {IARAgingSummaryData}
   */
  public reportData = (): IARAgingSummaryData => {
    const customersAgingPeriods = this.customersWalker(this.contacts);
    const customersTotal = this.getCustomersTotal(customersAgingPeriods);

    return {
      customers: customersAgingPeriods,
      total: customersTotal,
    };
  };

  /**
   * Retrieve A/R aging summary report columns.
   * @return {IARAgingSummaryColumns}
   */
  public reportColumns(): IARAgingSummaryColumns {
    return this.agingPeriods;
  }
}
