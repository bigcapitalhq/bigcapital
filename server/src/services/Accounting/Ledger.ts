import moment from 'moment';
import {
  ILedger,
  ILedgerEntry
} from 'interfaces';

export default class Ledger implements ILedger {
  readonly entries: ILedgerEntry[];

  /**
   * Constructor method.
   * @param {ILedgerEntry[]} entries 
   */
  constructor(entries: ILedgerEntry[]) {
    this.entries = Ledger.mappingEntries(entries);
  }

  /**
   * Filters the ledegr entries.
   * @param callback
   * @returns
   */
  filter(callback) {
    const entries = this.entries.filter(callback);
    return new Ledger(entries);
  }

  getEntries(): ILedgerEntry[] {
    return this.entries;
  }

  whereContactId(contactId: number): ILedger {
    return this.filter((entry) => entry.contactId === contactId);
  }

  whereAccountId(accountId: number): ILedger {
    return this.filter((entry) => entry.accountId === accountId);
  }

  whereFromDate(fromDate: Date | string): ILedger {
    const fromDateParsed = moment(fromDate);

    return this.filter(
      (entry) =>
        fromDateParsed.isBefore(entry.date) || fromDateParsed.isSame(entry.date)
    );
  }

  whereToDate(toDate: Date | string): ILedger {
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
  getClosingBalance() {
    let closingBalance = 0;

    this.entries.forEach((entry) => {
      if (entry.accountNormal === 'credit') {
        closingBalance += entry.credit ? entry.credit : -1 * entry.debit;

      } else if (entry.accountNormal === 'debit') {
        closingBalance += entry.debit ? entry.debit : -1 * entry.credit;
      }
    });
    return closingBalance;
  }

  static mappingEntries(entries): ILedgerEntry[] {
    return entries.map(this.mapEntry);
  }
  
  static mapEntry(entry): ILedgerEntry {
    return {
      credit: entry.credit,
      debit: entry.debit,
      accountNormal: entry.accountNormal,
      accountId: entry.accountId,
      contactId: entry.contactId,
      date: entry.date,
      transactionNumber: entry.transactionNumber,
      referenceNumber: entry.referenceNumber,
    }
  }
}
