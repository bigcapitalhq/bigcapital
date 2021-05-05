import * as R from 'ramda';
import FinancialSheet from '../FinancialSheet';
import { IAccountTransaction, ICustomer } from 'interfaces';
import { transaction } from 'objection';

export default class TransactionsByCustomers extends FinancialSheet {
  customers: ICustomer[];
  transactionsByContact: any;
  baseCurrency: string;

  /**
   * Constructor method.
   * @param {ICustomer} customers
   * @param transactionsByContact
   * @param {string} baseCurrency
   */
  constructor(
    customers: ICustomer[],
    transactionsByContact: Map<number, IAccountTransaction[]>,
    baseCurrency: string
  ) {
    super();

    this.customers = customers;
    this.transactionsByContact = transactionsByContact;
    this.baseCurrency = baseCurrency;
  }

  /**
   *
   */
  private customerTransactionMapper(
    transaction
  ): ITransactionsByCustomersTransaction {
    return {
      credit: transaction.credit,
      debit: transaction.debit,
      transactionNumber: transaction.transactionNumber,
      referenceNumber: transaction.referenceNumber,
      date: transaction.date,
      createdAt: transaction.createdAt,
    };
  }

  private customerTransactionRunningBalance(
    openingBalance: number,
    transaction: ITransactionsByCustomersTransaction
  ): ITransactionsByCustomersTransaction {
    
  }

  private customerTransactions(customerId: number) {
    const transactions = this.transactionsByContact.get(customerId + '') || [];

    return R.compose(
      R.map(this.customerTransactionMapper),
      R.map(R.curry(this.customerTransactionRunningBalance(0)))
    ).bind(this)(transactions);
  }

  private customerMapper(customer: ICustomer) {
    return {
      customerName: customer.displayName,
      openingBalance: {},
      closingBalance: {},
      transactions: this.customerTransactions(customer.id),
    };
  }

  private customersMapper(customers: ICustomer[]) {
    return customers.map(this.customerMapper.bind(this));
  }

  public reportData() {
    return this.customersMapper(this.customers);
  }

  public reportColumns() {
    return [];
  }
}
