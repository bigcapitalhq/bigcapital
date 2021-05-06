import * as R from 'ramda';
import { sumBy } from 'lodash';
import {
  ITransactionsByCustomersTransaction,
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersCustomer,
  ITransactionsByCustomersAmount,
  ITransactionsByCustomersData,
  INumberFormatQuery,
  IAccountTransaction,
  ICustomer,
} from 'interfaces';
import TransactionsByContact from '../TransactionsByContact/TransactionsByContact';

export default class TransactionsByCustomers extends TransactionsByContact {
  readonly customers: ICustomer[];
  readonly transactionsByContact: any;
  readonly filter: ITransactionsByCustomersFilter;
  readonly baseCurrency: string;
  readonly numberFormat: INumberFormatQuery;

  /**
   * Constructor method.
   * @param {ICustomer} customers
   * @param {Map<number, IAccountTransaction[]>} transactionsByContact
   * @param {string} baseCurrency
   */
  constructor(
    customers: ICustomer[],
    transactionsByContact: Map<number, IAccountTransaction[]>,
    filter: ITransactionsByCustomersFilter,
    baseCurrency: string
  ) {
    super();

    this.customers = customers;
    this.transactionsByContact = transactionsByContact;
    this.baseCurrency = baseCurrency;
    this.filter = filter;
    this.numberFormat = this.filter.numberFormat;
  }

  /**
   * Retrieve the customer transactions from the given customer id and opening balance.
   * @param {number} customerId - Customer id.
   * @param {number} openingBalance - Opening balance amount.
   * @returns {ITransactionsByCustomersTransaction[]}
   */
  private customerTransactions(
    customerId: number,
    openingBalance: number
  ): ITransactionsByCustomersTransaction[] {
    const transactions = this.transactionsByContact.get(customerId + '') || [];

    return R.compose(
      R.curry(this.contactTransactionRunningBalance)(openingBalance),
      R.map(this.contactTransactionMapper.bind(this))
    ).bind(this)(transactions);
  }

  /**
   * Customer section mapper.
   * @param {ICustomer} customer
   * @returns {ITransactionsByCustomersCustomer}
   */
  private customerMapper(
    customer: ICustomer
  ): ITransactionsByCustomersCustomer {
    const openingBalance = this.getContactOpeningBalance(1);
    const transactions = this.customerTransactions(customer.id, openingBalance);
    const closingBalance = this.getContactClosingBalance(transactions, 0);

    return {
      customerName: customer.displayName,
      openingBalance: this.getContactAmount(
        openingBalance,
        customer.currencyCode
      ),
      closingBalance: this.getContactAmount(
        closingBalance,
        customer.currencyCode
      ),
      transactions,
    };
  }

  /**
   * Retrieve the customers sections of the report.
   * @param {ICustomer[]} customers
   * @returns {ITransactionsByCustomersCustomer[]}
   */
  private customersMapper(
    customers: ICustomer[]
  ): ITransactionsByCustomersCustomer[] {
    return R.compose(R.map(this.customerMapper.bind(this))).bind(this)(
      customers
    );
  }

  /**
   * Retrieve the report data.
   * @returns {ITransactionsByCustomersData}
   */
  public reportData(): ITransactionsByCustomersData {
    return this.customersMapper(this.customers);
  }

  /**
   * Retrieve the report columns.
   */
  public reportColumns() {
    return [];
  }
}
