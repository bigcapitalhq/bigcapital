import { sumBy, defaultTo } from 'lodash';
import {
  ITransactionsByContactsTransaction,
  ITransactionsByContactsAmount,
  ITransactionsByContactsFilter,
  ITransactionsByContactsContact,
  IContact,
  ILedger,
  ILedgerEntry,
} from '@/interfaces';
import FinancialSheet from '../FinancialSheet';
import { allPassedConditionsPass } from 'utils';

export default class TransactionsByContact extends FinancialSheet {
  readonly contacts: IContact[];
  readonly ledger: ILedger;
  readonly filter: ITransactionsByContactsFilter;
  readonly accountsGraph: any;

  /**
   * Customer transaction mapper.
   * @param {any} transaction -
   * @return {Omit<ITransactionsByContactsTransaction, 'runningBalance'>}
   */
  protected contactTransactionMapper(
    entry: ILedgerEntry
  ): Omit<ITransactionsByContactsTransaction, 'runningBalance'> {
    const account = this.accountsGraph.getNodeData(entry.accountId);
    const currencyCode = this.baseCurrency;

    return {
      credit: this.getContactAmount(entry.credit, currencyCode),
      debit: this.getContactAmount(entry.debit, currencyCode),
      accountName: account.name,
      currencyCode: this.baseCurrency,
      transactionNumber: entry.transactionNumber,
      transactionType: this.i18n.__(entry.referenceTypeFormatted),
      date: entry.date,
      createdAt: entry.createdAt,
    };
  }

  /**
   * Customer transactions mapper with running balance.
   * @param {number} openingBalance
   * @param {ITransactionsByContactsTransaction[]} transactions
   * @returns {ITransactionsByContactsTransaction[]}
   */
  protected contactTransactionRunningBalance(
    openingBalance: number,
    accountNormal: 'credit' | 'debit',
    transactions: Omit<ITransactionsByContactsTransaction, 'runningBalance'>[]
  ): any {
    let _openingBalance = openingBalance;

    return transactions.map(
      (transaction: ITransactionsByContactsTransaction) => {
        _openingBalance +=
          accountNormal === 'debit'
            ? transaction.debit.amount
            : -1 * transaction.debit.amount;

        _openingBalance +=
          accountNormal === 'credit'
            ? transaction.credit.amount
            : -1 * transaction.credit.amount;

        const runningBalance = this.getTotalAmountMeta(
          _openingBalance,
          transaction.currencyCode
        );
        return { ...transaction, runningBalance };
      }
    );
  }

  /**
   * Retrieve the customer closing balance from the given transactions and opening balance.
   * @param {number} customerTransactions
   * @param {number} openingBalance
   * @returns {number}
   */
  protected getContactClosingBalance(
    customerTransactions: ITransactionsByContactsTransaction[],
    contactNormal: 'credit' | 'debit',
    openingBalance: number
  ): number {
    const closingBalance = openingBalance;

    const totalCredit = sumBy(customerTransactions, 'credit.amount');
    const totalDebit = sumBy(customerTransactions, 'debit.amount');

    const total =
      contactNormal === 'debit'
        ? totalDebit - totalCredit
        : totalCredit - totalDebit;

    return closingBalance + total;
  }

  /**
   * Retrieve the given customer opening balance from the given customer id.
   * @param {number} customerId
   * @returns {number}
   */
  protected getContactOpeningBalance(customerId: number): number {
    const openingBalanceLedger = this.ledger
      .whereContactId(customerId)
      .whereToDate(this.filter.fromDate);

    // Retrieve the closing balance of the ledger.
    const openingBalance = openingBalanceLedger.getClosingBalance();

    return defaultTo(openingBalance, 0);
  }

  /**
   * Retrieve the customer amount format meta.
   * @param {number} amount
   * @param {string} currencyCode
   * @returns {ITransactionsByContactsAmount}
   */
  protected getContactAmount(
    amount: number,
    currencyCode: string
  ): ITransactionsByContactsAmount {
    return {
      amount,
      formattedAmount: this.formatNumber(amount, { currencyCode }),
      currencyCode,
    };
  }

  /**
   * Retrieve the contact total amount format meta.
   * @param {number} amount - Amount.
   * @param {string} currencyCode - Currency code./
   * @returns {ITransactionsByContactsAmount}
   */
  protected getTotalAmountMeta(amount: number, currencyCode: string) {
    return {
      amount,
      formattedAmount: this.formatTotalNumber(amount, { currencyCode }),
      currencyCode,
    };
  }

  /**
   * Filter customer section that has no transactions.
   * @param {ITransactionsByCustomersCustomer} transactionsByCustomer
   * @returns {boolean}
   */
  private filterContactByNoneTransaction = (
    transactionsByContact: ITransactionsByContactsContact
  ): boolean => {
    return transactionsByContact.transactions.length > 0;
  };

  /**
   * Filters customer section has zero closing balance.
   * @param {ITransactionsByCustomersCustomer} transactionsByCustomer
   * @returns {boolean}
   */
  private filterContactNoneZero = (
    transactionsByContact: ITransactionsByContactsContact
  ): boolean => {
    return transactionsByContact.closingBalance.amount !== 0;
  };

  /**
   * Filters the given customer node;
   * @param {ICustomerBalanceSummaryCustomer} customer
   */
  private contactNodeFilter = (node: ITransactionsByContactsContact) => {
    const { noneTransactions, noneZero } = this.filter;

    // Conditions pair filter determiner.
    const condsPairFilters = [
      [noneTransactions, this.filterContactByNoneTransaction],
      [noneZero, this.filterContactNoneZero],
    ];
    return allPassedConditionsPass(condsPairFilters)(node);
  };

  /**
   * Filters the given customers nodes.
   * @param {ICustomerBalanceSummaryCustomer[]} nodes
   * @returns {ICustomerBalanceSummaryCustomer[]}
   */
  protected contactsFilter = (
    nodes: ITransactionsByContactsContact[]
  ): ITransactionsByContactsContact[] => {
    return nodes.filter(this.contactNodeFilter);
  };
}
