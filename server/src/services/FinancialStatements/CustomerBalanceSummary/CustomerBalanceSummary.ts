import { sumBy } from 'lodash';
import * as R from 'ramda';
import FinancialSheet from '../FinancialSheet';
import {
  IJournalPoster,
  ICustomer,
  ICustomerBalanceSummaryCustomer,
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryData,
  ICustomerBalanceSummaryTotal,
} from 'interfaces';

export class CustomerBalanceSummaryReport extends FinancialSheet {
  receivableLedger: IJournalPoster;
  baseCurrency: string;
  customers: ICustomer[];
  filter: ICustomerBalanceSummaryQuery;

  /**
   * Constructor method.
   * @param {IJournalPoster} receivableLedger
   * @param {ICustomer[]} customers
   * @param {ICustomerBalanceSummaryQuery} filter
   * @param {string} baseCurrency
   */
  constructor(
    receivableLedger: IJournalPoster,
    customers: ICustomer[],
    filter: ICustomerBalanceSummaryQuery,
    baseCurrency: string
  ) {
    super();

    this.receivableLedger = receivableLedger;
    this.baseCurrency = baseCurrency;
    this.customers = customers;
    this.filter = filter;
  }

  getAmountMeta(amount: number) {
    return {
      amount,
      formattedAmount: amount,
      currencyCode: this.baseCurrency,
    };
  }

  getPercentageMeta(amount: number) {
    return {
      amount,
      formattedAmount: this.formatPercentage(amount),
    };
  }

  /**
   * Customer section mapper.
   * @param {ICustomer} customer
   * @returns {ICustomerBalanceSummaryCustomer}
   */
  private customerMapper(customer: ICustomer): ICustomerBalanceSummaryCustomer {
    const balance = this.receivableLedger.getContactBalance(null, customer.id);

    return {
      customerName: customer.displayName,
      total: this.getAmountMeta(balance),
    };
  }

  /**
   * Retrieve the customer summary section with percentage of column.
   * @param {number} total
   * @param {ICustomerBalanceSummaryCustomer} customer
   * @returns {ICustomerBalanceSummaryCustomer}
   */
  private customerCamparsionPercentageOfColumnMapper(
    total: number,
    customer: ICustomerBalanceSummaryCustomer
  ): ICustomerBalanceSummaryCustomer {
    const amount = this.getCustomerPercentageOfColumn(
      total,
      customer.total.amount
    );
    return {
      ...customer,
      percentageOfColumn: this.getPercentageMeta(amount),
    };
  }

  /**
   * Mappes the customers summary sections with percentage of column.
   * @param {ICustomerBalanceSummaryCustomer[]} customers -
   * @return {ICustomerBalanceSummaryCustomer[]}
   */
  private customerCamparsionPercentageOfColumn(
    customers: ICustomerBalanceSummaryCustomer[]
  ): ICustomerBalanceSummaryCustomer[] {
    const customersTotal = this.getCustomersTotal(customers);
    const camparsionPercentageOfColummn = R.curry(
      this.customerCamparsionPercentageOfColumnMapper.bind(this)
    )(customersTotal);

    return customers.map(camparsionPercentageOfColummn);
  }

  /**
   * Mappes the customer model object to customer balance summary section.
   * @param {ICustomer[]} customers - Customers.
   * @returns {ICustomerBalanceSummaryCustomer[]}
   */
  private customersMapper(
    customers: ICustomer[]
  ): ICustomerBalanceSummaryCustomer[] {
    return customers.map(this.customerMapper.bind(this));
  }

  /**
   * Retrieve the customers sections of the report.
   * @param {ICustomer} customers
   * @returns {ICustomerBalanceSummaryCustomer[]}
   */
  private getCustomersSection(
    customers: ICustomer[]
  ): ICustomerBalanceSummaryCustomer[] {
    return R.compose(
      R.when(
        R.always(this.filter.comparison.percentageOfColumn),
        this.customerCamparsionPercentageOfColumn.bind(this)
      ),
      this.customersMapper.bind(this)
    ).bind(this)(customers);
  }

  /**
   * Retrieve the customers total.
   * @param {ICustomerBalanceSummaryCustomer} customers
   * @returns {number}
   */
  private getCustomersTotal(
    customers: ICustomerBalanceSummaryCustomer[]
  ): number {
    return sumBy(
      customers,
      (customer: ICustomerBalanceSummaryCustomer) => customer.total.amount
    );
  }

  /**
   * Calculates the customer percentage of column.
   * @param {number} customerBalance - Customer balance.
   * @param {number} totalBalance - Total customers balance.
   * @returns {number}
   */
  private getCustomerPercentageOfColumn(
    customerBalance: number,
    totalBalance: number
  ) {
    return customerBalance > 0 ? totalBalance / customerBalance : 0;
  }

  /**
   * Retrieve the customers total section.
   * @param {ICustomer[]} customers
   * @returns {ICustomerBalanceSummaryTotal}
   */
  private customersTotalSection(
    customers: ICustomerBalanceSummaryCustomer[]
  ): ICustomerBalanceSummaryTotal {
    const customersTotal = this.getCustomersTotal(customers);

    return {
      total: this.getAmountMeta(customersTotal),
      percentageOfColumn: this.getPercentageMeta(1),
    };
  }

  /**
   * Retrieve the report statement data.
   * @returns {ICustomerBalanceSummaryData}
   */
  public reportData(): ICustomerBalanceSummaryData {
    const customersSections = this.getCustomersSection(this.customers);
    const customersTotal = this.customersTotalSection(customersSections);

    return {
      customers: customersSections,
      total: customersTotal,
    };
  }

  reportColumns() {
    return [];
  }
}
