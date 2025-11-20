import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IManualJournalEventDeletedPayload,
  IManualJournalDeletingPayload,
} from '../types/ManualJournals.types';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ManualJournal } from '../models/ManualJournal';
import { ManualJournalEntry } from '../models/ManualJournalEntry';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteManualJournalService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(ManualJournal.name)
    private readonly manualJournalModel: TenantModelProxy<typeof ManualJournal>,

    @Inject(ManualJournalEntry.name)
    private readonly manualJournalEntryModel: TenantModelProxy<
      typeof ManualJournalEntry
    >,
  ) {}

  /**
   * Deletes the given manual journal
   * @param {number} manualJournalId
   * @param {Knex.Transaction} trx - Database transaction instance.
   * @return {Promise<void>}
   */
  public deleteManualJournal = async (
    manualJournalId: number,
    trx?: Knex.Transaction,
  ): Promise<{
    oldManualJournal: ManualJournal;
  }> => {
    // Validate the manual journal exists on the storage.
    const oldManualJournal = await this.manualJournalModel()
      .query()
      .findById(manualJournalId)
      .throwIfNotFound();

    // Deletes the manual journal with associated transactions under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onManualJournalDeleting` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onDeleting, {
        oldManualJournal,
        trx,
      } as IManualJournalDeletingPayload);

      // Deletes the manual journal entries.
      await this.manualJournalEntryModel()
        .query(trx)
        .where('manualJournalId', manualJournalId)
        .delete();

      // Deletes the manual journal transaction.
      await this.manualJournalModel()
        .query(trx)
        .findById(manualJournalId)
        .delete();

      // Triggers `onManualJournalDeleted` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onDeleted, {
        manualJournalId,
        oldManualJournal,
        trx,
      } as IManualJournalEventDeletedPayload);

      return { oldManualJournal };
    }, trx);
  };
}
