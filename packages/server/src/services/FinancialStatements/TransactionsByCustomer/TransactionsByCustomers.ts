import * as R from 'ramda';
import {
  ITransactionsByCustomersTransaction,
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersCustomer,
  ITransactionsByCustomersData,
  INumberFormatQuery,
  ICustomer,
} from '@/interfaces';
import TransactionsByContact from '../TransactionsByContact/TransactionsByContact';
import Ledger from '@/services/Accounting/Ledger';
import { isEmpty } from 'lodash';

const CUSTOMER_NORMAL = 'debit';

export default class TransactionsByCustomers extends TransactionsByContact {
  readonly customers: ICustomer[];
  readonly ledger: Ledger;
  readonly filter: ITransactionsByCustomersFilter;
  readonly baseCurrency: string;
  readonly numberFormat: INumberFormatQuery;
  readonly accountsGraph: any;

  /**
   * Constructor method.
   * @param {ICustomer} customers
   * @param {Map<number, IAccountTransaction[]>} transactionsLedger
   * @param {string} baseCurrency
   */
  constructor(
    customers: ICustomer[],
    accountsGraph: any,
    ledger: Ledger,
    filter: ITransactionsByCustomersFilter,
    baseCurrency: string,
    i18n
  ) {
    super();

    this.customers = customers;
    this.accountsGraph = accountsGraph;
    this.ledger = ledger;
    this.baseCurrency = baseCurrency;
    this.filter = filter;
    this.numberFormat = this.filter.numberFormat;
    this.i18n = i18n;
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
    const ledger = this.ledger
      .whereContactId(customerId)
      .whereFromDate(this.filter.fromDate)
      .whereToDate(this.filter.toDate);

    const ledgerEntries = ledger.getEntries();

    return R.compose(
      R.curry(this.contactTransactionRunningBalance)(openingBalance, 'debit'),
      R.map(this.contactTransactionMapper.bind(this))
    ).bind(this)(ledgerEntries);
  }

  /**
   * Customer section mapper.
   * @param {ICustomer} customer
   * @returns {ITransactionsByCustomersCustomer}
   */
  private customerMapper(
    customer: ICustomer
  ): ITransactionsByCustomersCustomer {
    const openingBalance = this.getContactOpeningBalance(customer.id);
    const transactions = this.customerTransactions(customer.id, openingBalance);
    const closingBalance = this.getCustomerClosingBalance(
      transactions,
      openingBalance
    );
    const currencyCode = this.baseCurrency;

    return {
      customerName: customer.displayName,
      openingBalance: this.getTotalAmountMeta(openingBalance, currencyCode),
      closingBalance: this.getTotalAmountMeta(closingBalance, currencyCode),
      transactions,
    };
  }

  /**
   * Retrieve the vendor closing balance from the given customer transactions.
   * @param {ITransactionsByContactsTransaction[]} customerTransactions
   * @param {number} openingBalance
   * @returns
   */
  private getCustomerClosingBalance(
    customerTransactions: ITransactionsByCustomersTransaction[],
    openingBalance: number
  ): number {
    return this.getContactClosingBalance(
      customerTransactions,
      CUSTOMER_NORMAL,
      openingBalance
    );
  }

  /**
   * Determines whether the customers post filter is active.
   * @returns {boolean}
   */
  private isCustomersPostFilter = () => {
    return isEmpty(this.filter.customersIds);
  };

  /**
   * Retrieve the customers sections of the report.
   * @param {ICustomer[]} customers
   * @returns {ITransactionsByCustomersCustomer[]}
   */
  private customersMapper(
    customers: ICustomer[]
  ): ITransactionsByCustomersCustomer[] {
    return R.compose(
      R.when(this.isCustomersPostFilter, this.contactsFilter),
      R.map(this.customerMapper.bind(this))
    ).bind(this)(customers);
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
