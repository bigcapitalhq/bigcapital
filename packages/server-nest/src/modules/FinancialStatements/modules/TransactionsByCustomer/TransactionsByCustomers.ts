import * as R from 'ramda';
import { isEmpty } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { ModelObject } from 'objection';
import {
  ITransactionsByCustomersTransaction,
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersCustomer,
  ITransactionsByCustomersData,
} from './TransactionsByCustomer.types';
import { TransactionsByContact } from '../TransactionsByContact/TransactionsByContact';
import { Customer } from '@/modules/Customers/models/Customer';
import { INumberFormatQuery } from '../../types/Report.types';
import { TransactionsByCustomersRepository } from './TransactionsByCustomersRepository';

const CUSTOMER_NORMAL = 'debit';

export class TransactionsByCustomers extends TransactionsByContact {
  readonly filter: ITransactionsByCustomersFilter;
  readonly numberFormat: INumberFormatQuery;
  readonly repository: TransactionsByCustomersRepository;
  readonly i18n: I18nService;

  /**
   * Constructor method.
   * @param {ICustomer} customers
   * @param {Map<number, IAccountTransaction[]>} transactionsLedger
   * @param {string} baseCurrency
   */
  constructor(
    filter: ITransactionsByCustomersFilter,
    transactionsByCustomersRepository: TransactionsByCustomersRepository,
    i18n: I18nService
  ) {
    super();

    this.filter = filter;
    this.repository = transactionsByCustomersRepository;
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
    const ledger = this.repository.ledger
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
   * @param {ModelObject<Customer>} customer
   * @returns {ITransactionsByCustomersCustomer}
   */
  private customerMapper(
    customer: ModelObject<Customer>
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
   * Detarmines whether the customers post filter is active.
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
    customers: ModelObject<Customer>[]
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
    return this.customersMapper(this.repository.customers);
  }
}
