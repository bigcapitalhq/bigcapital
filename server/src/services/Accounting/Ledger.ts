import moment from 'moment';
import { defaultTo } from 'lodash';
import { IAccountTransaction, ILedger, ILedgerEntry } from 'interfaces';
import EntityRepository from 'repositories/EntityRepository';

export default class Ledger implements ILedger {
  readonly entries: ILedgerEntry[];

  /**
   * Constructor method.
   * @param {ILedgerEntry[]} entries
   */
  constructor(entries: ILedgerEntry[]) {
    this.entries = entries;
  }

  /**
   * Filters the ledegr entries.
   * @param callback
   * @returns {ILedger}
   */
  public filter(callback): ILedger {
    const entries = this.entries.filter(callback);
    return new Ledger(entries);
  }

  /**
   * Retrieve the all entries of the ledger.
   * @return {ILedgerEntry[]}
   */
  public getEntries(): ILedgerEntry[] {
    return this.entries;
  }

  /**
   * Filters entries by th given contact id and returns a new ledger.
   * @param {number} contactId
   * @returns {ILedger}
   */
  public whereContactId(contactId: number): ILedger {
    return this.filter((entry) => entry.contactId === contactId);
  }

  /**
   * Filters entries by the given account id and returns a new ledger.
   * @param {number} accountId
   * @returns {ILedger}
   */
  public whereAccountId(accountId: number): ILedger {
    return this.filter((entry) => entry.accountId === accountId);
  }

  /**
   * Filters entries that before or same the given date and returns a new ledger.
   * @param {Date|string} fromDate
   * @returns {ILedger}
   */
  public whereFromDate(fromDate: Date | string): ILedger {
    const fromDateParsed = moment(fromDate);

    return this.filter(
      (entry) =>
        fromDateParsed.isBefore(entry.date) || fromDateParsed.isSame(entry.date)
    );
  }

  /**
   * Filters ledger entries that after the given date and retruns a new ledger.
   * @param {Date|string} toDate
   * @returns {ILedger}
   */
  public whereToDate(toDate: Date | string): ILedger {
    const toDateParsed = moment(toDate);

    return this.filter(
      (entry) =>
        toDateParsed.isAfter(entry.date) || toDateParsed.isSame(entry.date)
    );
  }

  /**
   * Retrieve the closing balance of the entries.
   * @returns {number}
   */
  public getClosingBalance(): number {
    let closingBalance = 0;

    this.entries.forEach((entry) => {
      if (entry.accountNormal === 'credit') {
        closingBalance += entry.credit - entry.debit;
      } else if (entry.accountNormal === 'debit') {
        closingBalance += entry.debit - entry.credit;
      }
    });
    return closingBalance;
  }

  /**
   * Mappes the account transactions to ledger entries.
   * @param {IAccountTransaction[]} entries
   * @returns {ILedgerEntry[]}
   */
  static mappingTransactions(entries: IAccountTransaction[]): ILedgerEntry[] {
    return entries.map(this.mapTransaction);
  }

  /**
   * Mappes the account transaction to ledger entry.
   * @param {IAccountTransaction} entry
   * @returns {ILedgerEntry}
   */
  static mapTransaction(entry: IAccountTransaction): ILedgerEntry {
    return {
      credit: defaultTo(entry.credit, 0),
      debit: defaultTo(entry.debit, 0),
      accountNormal: entry.account.accountNormal,
      accountId: entry.accountId,
      contactId: entry.contactId,
      date: entry.date,
      transactionNumber: entry.transactionNumber,
      transactionType: entry.referenceTypeFormatted,
      referenceNumber: entry.referenceNumber,
      referenceType: entry.referenceType,
    };
  }

  /**
   * Mappes the account transactions to ledger entries.
   * @param {IAccountTransaction[]} transactions
   * @returns {ILedger}
   */
  static fromTransactions(transactions: IAccountTransaction[]): ILedger {
    const entries = Ledger.mappingTransactions(transactions);
    return new Ledger(entries);
  }
}
