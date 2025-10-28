import { Knex } from 'knex';
import * as async from 'async';
import { Inject, Injectable } from '@nestjs/common';
import { transformLedgerEntryToTransaction } from './utils';
import {
  ILedgerEntry,
  ISaveLedgerEntryQueuePayload,
} from './types/Ledger.types';
import { ILedger } from './types/Ledger.types';
import { AccountTransaction } from '../Accounts/models/AccountTransaction.model';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

// Filter the blank entries.
const filterBlankEntry = (entry: ILedgerEntry) =>
  Boolean(entry.credit || entry.debit);

@Injectable()
export class LedgerEntriesStorageService {
  /**
   * @param {TenantModelProxy<typeof AccountTransaction>} accountTransactionModel - Account transaction model.
   */
  constructor(
    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: TenantModelProxy<
      typeof AccountTransaction
    >,
  ) {}

  /**
   * Saves entries of the given ledger.
   * @param {ILedger} ledger - Ledger.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public saveEntries = async (ledger: ILedger, trx?: Knex.Transaction) => {
    const saveEntryQueue = async.queue(this.saveEntryTask.bind(this), 10);
    const entries = ledger.filter(filterBlankEntry).getEntries();

    entries.forEach((entry) => {
      saveEntryQueue.push({ entry, trx });
    });
    if (entries.length > 0) await saveEntryQueue.drain();
  };

  /**
   * Deletes the ledger entries.
   * @param {ILedger} ledger - Ledger.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public deleteEntries = async (ledger: ILedger, trx?: Knex.Transaction) => {
    const entriesIds = ledger
      .getEntries()
      .filter((e) => e.entryId)
      .map((e) => e.entryId);

    await this.accountTransactionModel()
      .query(trx)
      .whereIn('id', entriesIds)
      .delete();
  };

  /**
   * Saves the ledger entry to the account transactions repository.
   * @param {ILedgerEntry} entry - Ledger entry.
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  private saveEntry = async (
    entry: ILedgerEntry,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const transaction = transformLedgerEntryToTransaction(entry);

    await this.accountTransactionModel().query(trx).insert(transaction);
  };

  /**
   * Save the ledger entry to the transactions repository async task.
   * @param {ISaveLedgerEntryQueuePayload} task - Task payload.
   * @returns {Promise<void>}
   */
  private saveEntryTask = async (
    task: ISaveLedgerEntryQueuePayload,
  ): Promise<void> => {
    const { entry, trx } = task;

    await this.saveEntry(entry, trx);
  };
}
