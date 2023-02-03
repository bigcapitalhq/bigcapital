import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import async from 'async';
import {
  ILedgerEntry,
  ISaveLedgerEntryQueuePayload,
  ILedger,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { transformLedgerEntryToTransaction } from './utils';

@Service()
export class LedgerEntriesStorage {
  @Inject()
  tenancy: HasTenancyService;
  /**
   * Saves entries of the given ledger.
   * @param   {number} tenantId
   * @param   {ILedger} ledger
   * @param   {Knex.Transaction} knex
   * @returns {Promise<void>}
   */
  public saveEntries = async (
    tenantId: number,
    ledger: ILedger,
    trx?: Knex.Transaction
  ) => {
    const saveEntryQueue = async.queue(this.saveEntryTask, 10);
    const entries = ledger.getEntries();

    entries.forEach((entry) => {
      saveEntryQueue.push({ tenantId, entry, trx });
    });
    if (entries.length > 0) await saveEntryQueue.drain();
  };

  /**
   * Deletes the ledger entries.
   * @param {number} tenantId
   * @param {ILedger} ledger
   * @param {Knex.Transaction} trx
   */
  public deleteEntries = async (
    tenantId: number,
    ledger: ILedger,
    trx?: Knex.Transaction
  ) => {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    const entriesIds = ledger
      .getEntries()
      .filter((e) => e.entryId)
      .map((e) => e.entryId);

    await AccountTransaction.query(trx).whereIn('id', entriesIds).delete();
  };

  /**
   * Saves the ledger entry to the account transactions repository.
   * @param   {number} tenantId
   * @param   {ILedgerEntry} entry
   * @returns {Promise<void>}
   */
  private saveEntry = async (
    tenantId: number,
    entry: ILedgerEntry,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const transaction = transformLedgerEntryToTransaction(entry);

    await AccountTransaction.query(trx).insert(transaction);
  };

  /**
   * Save the ledger entry to the transactions repository async task.
   * @param   {ISaveLedgerEntryQueuePayload} task
   * @returns {Promise<void>}
   */
  private saveEntryTask = async (
    task: ISaveLedgerEntryQueuePayload
  ): Promise<void> => {
    const { entry, tenantId, trx } = task;

    await this.saveEntry(tenantId, entry, trx);
  };
}
