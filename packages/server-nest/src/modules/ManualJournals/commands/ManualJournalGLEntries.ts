import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { ManualJournal } from '../models/ManualJournal';
import { ManualJournalGL } from './ManualJournalGL';

@Injectable()
export class ManualJournalGLEntries {
  /**
   * @param {typeof ManualJournal} manualJournalModel - The manual journal model.
   * @param {LedgerStorageService} ledgerStorage - The ledger storage service.
   */
  constructor(
    @Inject(ManualJournal.name)
    private readonly manualJournalModel: typeof ManualJournal,
    private readonly ledgerStorage: LedgerStorageService,
  ) {}

  /**
   * Create manual journal GL entries.
   * @param {number} manualJournalId - The manual journal ID.
   * @param {Knex.Transaction} trx - The knex transaction.
   */
  public createManualJournalGLEntries = async (
    manualJournalId: number,
    trx?: Knex.Transaction,
  ) => {
    // Retrieves the given manual journal with associated entries.
    const manualJournal = await this.manualJournalModel
      .query(trx)
      .findById(manualJournalId)
      .withGraphFetched('entries.account');

    // Retrieves the ledger entries of the given manual journal.
    const ledger = new ManualJournalGL(manualJournal).getManualJournalGLedger();

    // Commits the given ledger on the storage.
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Edits manual journal GL entries.
   * @param {number} manualJournalId - The manual journal ID.
   * @param {Knex.Transaction} trx - The knex transaction.
   */
  public editManualJournalGLEntries = async (
    manualJournalId: number,
    trx?: Knex.Transaction,
  ) => {
    // Reverts the manual journal GL entries.
    await this.revertManualJournalGLEntries(manualJournalId, trx);

    // Write the manual journal GL entries.
    await this.createManualJournalGLEntries(manualJournalId, trx);
  };

  /**
   * Deletes the manual journal GL entries.
   * @param {number} manualJournalId - The manual journal ID.
   * @param {Knex.Transaction} trx - The knex transaction.
   */
  public revertManualJournalGLEntries = async (
    manualJournalId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    return this.ledgerStorage.deleteByReference(
      manualJournalId,
      'Journal',
      trx,
    );
  };
}
