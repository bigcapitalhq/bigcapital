import { groupBy, sum } from 'lodash';
import {
  ICustomer,
  IARAgingSummaryQuery,
  IARAgingSummaryCustomer,
  IAgingPeriod,
  ISaleInvoice,
  IARAgingSummaryData,
  IARAgingSummaryColumns,
} from 'interfaces';
import AgingSummaryReport from './AgingSummary';
import { Dictionary } from 'tsyringe/dist/typings/types';

export default class ARAgingSummarySheet extends AgingSummaryReport {
  readonly tenantId: number;
  readonly query: IARAgingSummaryQuery;
  readonly contacts: ICustomer[];
  readonly agingPeriods: IAgingPeriod[];
  readonly baseCurrency: string;

  readonly overdueInvoicesByContactId: Dictionary<ISaleInvoice[]>;
  readonly currentInvoicesByContactId: Dictionary<ISaleInvoice[]>;

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
    customers: ICustomer[],
    overdueSaleInvoices: ISaleInvoice[],
    currentSaleInvoices: ISaleInvoice[],
    baseCurrency: string
  ) {
    super();

    this.tenantId = tenantId;
    this.contacts = customers;
    this.query = query;
    this.baseCurrency = baseCurrency;
    this.numberFormat = this.query.numberFormat;

    this.overdueInvoicesByContactId = groupBy(overdueSaleInvoices, 'customerId');
    this.currentInvoicesByContactId = groupBy(currentSaleInvoices, 'customerId');

    // Initializes the aging periods.
    this.agingPeriods = this.agingRangePeriods(
      this.query.asDate,
      this.query.agingDaysBefore,
      this.query.agingPeriods
    );
  }

  /**
   * Mapping aging customer.
   * @param {ICustomer} customer -
   * @return {IARAgingSummaryCustomer[]}
   */
  private customerData(customer: ICustomer): IARAgingSummaryCustomer {
    const agingPeriods = this.getContactAgingPeriods(customer.id);
    const currentTotal = this.getContactCurrentTotal(customer.id);
    const agingPeriodsTotal = this.getAgingPeriodsTotal(agingPeriods);
    const amount = sum([agingPeriodsTotal, currentTotal]);

    return {
      customerName: customer.displayName,
      current: this.formatTotalAmount(currentTotal),
      aging: agingPeriods,
      total: this.formatTotalAmount(amount),
    };
  }

  /**
   * Retrieve customers report.
   * @param {ICustomer[]} customers
   * @return {IARAgingSummaryCustomer[]}
   */
  private customersWalker(customers: ICustomer[]): IARAgingSummaryCustomer[] {
    return customers
      .map((customer) => this.customerData(customer))
      .filter(
        (customer: IARAgingSummaryCustomer) =>
          !(customer.total.total === 0 && this.query.noneZero)
      );
  }

  /**
   * Retrieve A/R aging summary report data.
   * @return {IARAgingSummaryData}
   */
  public reportData(): IARAgingSummaryData {
    const customersAgingPeriods = this.customersWalker(this.contacts);
    const totalAgingPeriods = this.getTotalAgingPeriods(customersAgingPeriods);
    const totalCurrent = this.getTotalCurrent(customersAgingPeriods);

    return {
      customers: customersAgingPeriods,
      total: {
        current: this.formatTotalAmount(totalCurrent),
        aging: totalAgingPeriods,
      }
    };
  }

  /**
   * Retrieve AR aging summary report columns.
   * @return {IARAgingSummaryColumns}
   */
  public reportColumns(): IARAgingSummaryColumns {
    return this.agingPeriods;
  }
}
