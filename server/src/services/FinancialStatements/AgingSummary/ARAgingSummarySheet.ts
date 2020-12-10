import {
  ICustomer,
  IARAgingSummaryQuery,
  ARAgingSummaryCustomer,
  IAgingPeriodClosingBalance,
  IAgingPeriodTotal,
  IJournalPoster,
  IAccount,
  IAgingPeriod
} from "interfaces";
import AgingSummaryReport from './AgingSummary';


export default class ARAgingSummarySheet extends AgingSummaryReport {
  tenantId: number;
  query: IARAgingSummaryQuery;
  customers: ICustomer[];
  journal: IJournalPoster;
  ARAccount: IAccount;
  agingPeriods: IAgingPeriod[];
  baseCurrency: string;

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
    journal: IJournalPoster,
    ARAccount: IAccount,
    baseCurrency: string,
  ) {
    super();

    this.tenantId = tenantId;
    this.customers = customers;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.journal = journal;
    this.ARAccount = ARAccount;
    this.baseCurrency = baseCurrency;

    this.initAgingPeriod();
  }

  /**
   * Initializes the aging periods.
   */
  private initAgingPeriod() {
    this.agingPeriods = this.agingRangePeriods(
      this.query.asDate,
      this.query.agingDaysBefore,
      this.query.agingPeriods
    );
  }

  /**
   * 
   * @param {ICustomer} customer 
   * @param {IAgingPeriod} agingPeriod 
   */
  private agingPeriodCloser(
    customer: ICustomer,
    agingPeriod: IAgingPeriod,
  ): IAgingPeriodClosingBalance {
    // Calculate the trial balance between the given date period.
    const agingTrialBalance = this.journal.getContactTrialBalance(
      this.ARAccount.id,
      customer.id,
      'customer',
      agingPeriod.fromPeriod,
    );
    return {
      ...agingPeriod,
      closingBalance: agingTrialBalance.debit,
    };
  }

  /**
   * 
   * @param {ICustomer} customer 
   */
  private getCustomerAging(customer: ICustomer, totalReceivable: number): IAgingPeriodTotal[] {
    const agingClosingBalance = this.agingPeriods
      .map((agingPeriod: IAgingPeriod) => this.agingPeriodCloser(customer, agingPeriod));

    const aging = this.contactAgingBalance(
      agingClosingBalance,
      totalReceivable
    );
    return aging;
  }

  /**
   * Mapping aging customer.
   * @param {ICustomer} customer -
   * @return {ARAgingSummaryCustomer[]}
   */
  private customerMapper(customer: ICustomer): ARAgingSummaryCustomer {
    // Calculate the trial balance total of the given customer.
    const trialBalance = this.journal.getContactTrialBalance(
      this.ARAccount.id,
      customer.id,
      'customer'
    );
    const amount = trialBalance.balance;
    const formattedAmount = this.formatNumber(amount);
    const currencyCode = this.baseCurrency;

    return {
      customerName: customer.displayName,
      aging: this.getCustomerAging(customer, trialBalance.balance),
      total: {
        amount,
        formattedAmount,
        currencyCode,
      },
    };
  }

  /**
   * Retrieve customers walker.
   * @param {ICustomer[]} customers 
   * @return {ARAgingSummaryCustomer[]}
   */
  private customersWalker(customers: ICustomer[]): ARAgingSummaryCustomer[] {
    return customers
      .map((customer: ICustomer) => this.customerMapper(customer))

      // Filter customers that have zero total amount when `noneZero` is on.
      .filter((customer: ARAgingSummaryCustomer) =>
        !(customer.total.amount === 0 && this.query.noneZero),
      );
  }

  /**
   * Retrieve AR. aging summary report data.
   */
  public reportData() {
    return this.customersWalker(this.customers);
  }

  /**
   * Retrieve AR aging summary report columns.
   */
  reportColumns() {
    return []
  }
}