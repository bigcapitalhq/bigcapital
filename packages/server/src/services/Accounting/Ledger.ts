import moment from 'moment';
import { defaultTo, uniqBy } from 'lodash';
import { IAccountTransaction, ILedger, ILedgerEntry } from '@/interfaces';

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
   * Filters the ledger entries.
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
   * @param   {number} contactId
   * @returns {ILedger}
   */
  public whereContactId(contactId: number): ILedger {
    return this.filter((entry) => entry.contactId === contactId);
  }

  /**
   * Filters entries by the given account id and returns a new ledger.
   * @param   {number} accountId
   * @returns {ILedger}
   */
  public whereAccountId(accountId: number): ILedger {
    return this.filter((entry) => entry.accountId === accountId);
  }

  /**
   * Filters entries that before or same the given date and returns a new ledger.
   * @param   {Date|string} fromDate
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
   * @param   {Date|string} toDate
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
   * Filters the ledget entries by the given currency code.
   * @param   {string} currencyCode -
   * @returns {ILedger}
   */
  public whereCurrencyCode(currencyCode: string): ILedger {
    return this.filter((entry) => entry.currencyCode === currencyCode);
  }

  /**
   * Filters the ledger entries by the given branch id.
   * @param   {number} branchId
   * @returns {ILedger}
   */
  public whereBranch(branchId: number): ILedger {
    return this.filter((entry) => entry.branchId === branchId);
  }

  /**
   *
   * @param   {number} projectId
   * @returns {ILedger}
   */
  public whereProject(projectId: number): ILedger {
    return this.filter((entry) => entry.projectId === projectId);
  }

  /**
   * Filters the ledger entries by the given item id.
   * @param   {number} itemId
   * @returns {ILedger}
   */
  public whereItem(itemId: number): ILedger {
    return this.filter((entry) => entry.itemId === itemId);
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
   * Retrieve the closing balance of the entries.
   * @returns {number}
   */
  public getForeignClosingBalance(): number {
    let closingBalance = 0;

    this.entries.forEach((entry) => {
      const exchangeRate = entry.exchangeRate || 1;

      if (entry.accountNormal === 'credit') {
        closingBalance += (entry.credit - entry.debit) / exchangeRate;
      } else if (entry.accountNormal === 'debit') {
        closingBalance += (entry.debit - entry.credit) / exchangeRate;
      }
    });
    return closingBalance;
  }

  /**
   * Determines whether the ledger has no entries.
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return this.entries.length === 0;
  }

  /**
   * Retrieves the accounts ids of the entries uniquely.
   * @returns {number[]}
   */
  public getAccountsIds = (): number[] => {
    return uniqBy(this.entries, 'accountId').map(
      (e: ILedgerEntry) => e.accountId
    );
  };

  /**
   * Retrieves the contacts ids of the entries uniquely.
   * @returns {number[]}
   */
  public getContactsIds = (): number[] => {
    return uniqBy(this.entries, 'contactId')
      .filter((e: ILedgerEntry) => e.contactId)
      .map((e: ILedgerEntry) => e.contactId);
  };

  /**
   * Reverses the ledger entries.
   * @returns {Ledger}
   */
  public reverse = (): Ledger => {
    const newEntries = this.entries.map((e) => {
      const credit = e.debit;
      const debit = e.credit;

      return { ...e, credit, debit };
    });
    return new Ledger(newEntries);
  };

  // ---------------------------------
  // # STATIC METHODS.
  // ----------------------------------

  /**
   * Mappes the account transactions to ledger entries.
   * @param   {IAccountTransaction[]} entries
   * @returns {ILedgerEntry[]}
   */
  static mappingTransactions(entries: IAccountTransaction[]): ILedgerEntry[] {
    return entries.map(this.mapTransaction);
  }

  /**
   * Mappes the account transaction to ledger entry.
   * @param   {IAccountTransaction} entry
   * @returns {ILedgerEntry}
   */
  static mapTransaction(entry: IAccountTransaction): ILedgerEntry {
    return {
      credit: defaultTo(entry.credit, 0),
      debit: defaultTo(entry.debit, 0),
      exchangeRate: entry.exchangeRate,
      currencyCode: entry.currencyCode,

      accountNormal: entry.account.accountNormal,
      accountId: entry.accountId,
      contactId: entry.contactId,

      date: entry.date,

      transactionId: entry.referenceId,
      transactionType: entry.referenceType,

      transactionNumber: entry.transactionNumber,
      referenceNumber: entry.referenceNumber,

      index: entry.index,
      indexGroup: entry.indexGroup,

      entryId: entry.id,
      branchId: entry.branchId,
      projectId: entry.projectId,
    };
  }

  /**
   * Mappes the account transactions to ledger entries.
   * @param {IAccountTransaction[]} transactions
   * @returns {ILedger}
   */
  static fromTransactions(transactions: IAccountTransaction[]): Ledger {
    const entries = Ledger.mappingTransactions(transactions);
    return new Ledger(entries);
  }
}
