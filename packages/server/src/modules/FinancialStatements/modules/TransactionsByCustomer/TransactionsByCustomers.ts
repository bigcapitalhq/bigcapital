import { isEmpty } from 'lodash';
import { flow } from 'fp-ts/function';
import { when } from '@/common/fp';
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
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { INumberFormatQuery } from '../../types/Report.types';
import { TransactionsByCustomersRepository } from './TransactionsByCustomersRepository';
import {
  IFinancialReportMeta,
  DEFAULT_REPORT_META,
} from '../../types/Report.types';

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
   * @param {I18nService} i18n
   * @param {IFinancialReportMeta} meta
   */
  constructor(
    filter: ITransactionsByCustomersFilter,
    transactionsByCustomersRepository: TransactionsByCustomersRepository,
    i18n: I18nService,
    meta: IFinancialReportMeta,
  ) {
    super();

    this.filter = filter;
    this.repository = transactionsByCustomersRepository;
    this.numberFormat = this.filter.numberFormat;
    this.i18n = i18n;
    this.baseCurrency = meta.baseCurrency;
    this.dateFormat = meta.dateFormat || DEFAULT_REPORT_META.dateFormat;
  }

  /**
   * Retrieve the customer transactions from the given customer id and opening balance.
   * @param {number} customerId - Customer id.
   * @param {number} openingBalance - Opening balance amount.
   * @returns {ITransactionsByCustomersTransaction[]}
   */
  private customerTransactions(
    customerId: number,
    openingBalance: number,
  ): ITransactionsByCustomersTransaction[] {
    const ledger = this.repository.ledger
      .whereContactId(customerId)
      .whereFromDate(this.filter.fromDate)
      .whereToDate(this.filter.toDate);

    const ledgerEntries = ledger.getEntries();

    return flow(
      (entries: ILedgerEntry[]) =>
        entries.map((entry) => this.contactTransactionMapper(entry)),
      (transactions) =>
        this.contactTransactionRunningBalance(
          openingBalance,
          'debit',
          transactions,
        ),
    )(ledgerEntries);
  }

  /**
   * Customer section mapper.
   * @param {ModelObject<Customer>} customer
   * @returns {ITransactionsByCustomersCustomer}
   */
  private customerMapper(
    customer: ModelObject<Customer>,
  ): ITransactionsByCustomersCustomer {
    const openingBalance = this.getContactOpeningBalance(customer.id);
    const transactions = this.customerTransactions(customer.id, openingBalance);
    const closingBalance = this.getCustomerClosingBalance(
      transactions,
      openingBalance,
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
    openingBalance: number,
  ): number {
    return this.getContactClosingBalance(
      customerTransactions,
      CUSTOMER_NORMAL,
      openingBalance,
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
    customers: ModelObject<Customer>[],
  ): ITransactionsByCustomersCustomer[] {
    return flow(
      (nodes: ModelObject<Customer>[]) =>
        nodes.map((customer) => this.customerMapper(customer)),
      when(this.isCustomersPostFilter, this.contactsFilter),
    )(customers) as ITransactionsByCustomersCustomer[];
  }

  /**
   * Retrieve the report data.
   * @returns {ITransactionsByCustomersData}
   */
  public reportData(): ITransactionsByCustomersData {
    return this.customersMapper(this.repository.customers);
  }
}
