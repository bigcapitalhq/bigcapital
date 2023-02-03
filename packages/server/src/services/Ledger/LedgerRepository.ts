import { Service } from 'typedi';
import { omit } from 'lodash';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import Knex from 'knex';
import { ILedgerEntry } from '@/interfaces';

@Service()
export default class LedgerRepository {
  /**
   * 
   * @param {number} tenantId 
   * @param {ILedgerEntry[]} ledgerEntries 
   * @param {Knex.Transaction} trx 
   */
  public saveLedgerEntries = async (
    tenantId: number,
    ledgerEntries: ILedgerEntry[],
    trx?: Knex.Transaction
  ) => {
    const journal = new JournalPoster(tenantId, null, trx);

    ledgerEntries.forEach((ledgerEntry) => {
      const entry = new JournalEntry({
        ...omit(ledgerEntry, [
          'accountNormal',
          'referenceNo',
          'transactionId',
          'transactionType',
        ]),
        contactId: ledgerEntry.contactId,
        account: ledgerEntry.accountId,
        referenceId: ledgerEntry.transactionId,
        referenceType: ledgerEntry.transactionType,
        referenceNumber: ledgerEntry.referenceNo,
        transactionNumber: ledgerEntry.transactionNumber,
        index: ledgerEntry.index,
        indexGroup: ledgerEntry.indexGroup,
      });

      if (ledgerEntry.credit) {
        journal.credit(entry);
      }
      if (ledgerEntry.debit) {
        journal.debit(entry);
      }
    });

    await Promise.all([
      journal.deleteEntries(),
      journal.saveBalance(),
      journal.saveContactsBalance(),
      journal.saveEntries(),
    ]);
  }
}
