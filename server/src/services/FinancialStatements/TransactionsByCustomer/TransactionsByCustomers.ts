import * as R from 'ramda';
import { sumBy } from 'lodash';
import FinancialSheet from '../FinancialSheet';
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

export default class TransactionsByCustomers extends FinancialSheet {
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
   * Customer transaction mapper.
   * @param {any} transaction -
   * @return {Omit<ITransactionsByCustomersTransaction, 'runningBalance'>}
   */
  private customerTransactionMapper(
    transaction
  ): Omit<ITransactionsByCustomersTransaction, 'runningBalance'> {
    const currencyCode = 'USD';

    return {
      credit: this.getCustomerAmount(transaction.credit, currencyCode),
      debit: this.getCustomerAmount(transaction.debit, currencyCode),
      currencyCode: 'USD',
      transactionNumber: transaction.transactionNumber,
      referenceNumber: transaction.referenceNumber,
      date: transaction.date,
      createdAt: transaction.createdAt,
    };
  }

  /**
   * Customer transactions mapper with running balance.
   * @param {number} openingBalance
   * @param {ITransactionsByCustomersTransaction[]} transactions
   * @returns {ITransactionsByCustomersTransaction[]}
   */
  private customerTransactionRunningBalance(
    openingBalance: number,
    transactions: Omit<ITransactionsByCustomersTransaction, 'runningBalance'>[]
  ): any {
    let _openingBalance = openingBalance;

    return transactions.map(
      (transaction: ITransactionsByCustomersTransaction) => {
        _openingBalance += transaction.debit.amount;
        _openingBalance -= transaction.credit.amount;

        const runningBalance = this.getCustomerAmount(
          _openingBalance,
          transaction.currencyCode
        );
        return { ...transaction, runningBalance };
      }
    );
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
      R.curry(this.customerTransactionRunningBalance)(openingBalance),
      R.map(this.customerTransactionMapper.bind(this))
    ).bind(this)(transactions);
  }

  /**
   * Retrieve the customer closing balance from the given transactions and opening balance.
   * @param {number} customerTransactions
   * @param {number} openingBalance
   * @returns {number}
   */
  private getCustomerClosingBalance(
    customerTransactions: ITransactionsByCustomersTransaction[],
    openingBalance: number
  ): number {
    const closingBalance = openingBalance;

    const totalCredit = sumBy(customerTransactions, 'credit');
    const totalDebit = sumBy(customerTransactions, 'debit');

    return closingBalance + (totalDebit - totalCredit);
  }

  /**
   * Retrieve the given customer opening balance from the given customer id.
   * @param {number} customerId
   * @returns {number}
   */
  private getCustomerOpeningBalance(customerId: number): number {
    return 0;
  }

  /**
   * Customer section mapper.
   * @param {ICustomer} customer
   * @returns {ITransactionsByCustomersCustomer}
   */
  private customerMapper(
    customer: ICustomer
  ): ITransactionsByCustomersCustomer {
    const openingBalance = this.getCustomerOpeningBalance(1);
    const transactions = this.customerTransactions(customer.id, openingBalance);
    const closingBalance = this.getCustomerClosingBalance(transactions, 0);

    return {
      customerName: customer.displayName,
      openingBalance: this.getCustomerAmount(
        openingBalance,
        customer.currencyCode
      ),
      closingBalance: this.getCustomerAmount(
        closingBalance,
        customer.currencyCode
      ),
      transactions,
    };
  }

  /**
   * Retrieve the customer amount format meta.
   * @param {number} amount
   * @param {string} currencyCode
   * @returns {ITransactionsByCustomersAmount}
   */
  private getCustomerAmount(
    amount: number,
    currencyCode: string
  ): ITransactionsByCustomersAmount {
    return {
      amount,
      formattedAmount: this.formatNumber(amount, { currencyCode }),
      currencyCode,
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
