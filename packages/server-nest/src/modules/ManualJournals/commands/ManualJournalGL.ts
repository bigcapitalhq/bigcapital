import { Ledger } from '@/modules/Ledger/Ledger';
import { ManualJournal } from '../models/ManualJournal';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { ManualJournalEntry } from '../models/ManualJournalEntry';

export class ManualJournalGL {
  manualJournal: ManualJournal;

  constructor(manualJournal: ManualJournal) {
    this.manualJournal = manualJournal;
  }

  /**
   * Retrieves the ledger of the given manual journal.
   * @param {ManualJournal} manualJournal - The manual journal.
   * @returns {Ledger}
   */
  public getManualJournalGLedger = () => {
    const entries = this.getManualJournalGLEntries();

    return new Ledger(entries);
  };

  /**
   * Retrieves the common entry details of the manual journal
   * @param {IManualJournal} manualJournal - The manual journal.
   * @returns {Partial<ILedgerEntry>}
   */
  public get manualJournalCommonEntry() {
    return {
      transactionNumber: this.manualJournal.journalNumber,
      referenceNumber: this.manualJournal.reference,
      createdAt: this.manualJournal.createdAt,
      date: this.manualJournal.date,
      currencyCode: this.manualJournal.currencyCode,
      exchangeRate: this.manualJournal.exchangeRate,

      transactionType: 'Journal',
      transactionId: this.manualJournal.id,

      userId: this.manualJournal.userId,
    };
  }

  /**
   * Retrieves the ledger entry of the given manual journal and
   * its associated entry.
   * @param {IManualJournal} manualJournal - The manual journal.
   * @param {IManualJournalEntry} entry - The manual journal entry.
   * @returns {ILedgerEntry}
   */
  public getManualJournalEntry(entry: ManualJournalEntry): ILedgerEntry {
    const commonEntry = this.manualJournalCommonEntry;

    return {
      ...commonEntry,
      debit: entry.debit,
      credit: entry.credit,
      accountId: entry.accountId,

      contactId: entry.contactId,
      note: entry.note,

      index: entry.index,
      accountNormal: entry.account.accountNormal,

      branchId: entry.branchId,
      projectId: entry.projectId,
    };
  }

  /**
   * Retrieves the ledger entries of the given manual journal.
   * @param {IManualJournal} manualJournal - The manual journal.
   * @returns {ILedgerEntry[]}
   */
  public getManualJournalGLEntries = (): ILedgerEntry[] => {
    return this.manualJournal.entries.map(this.getManualJournalEntry).flat();
  };
}
