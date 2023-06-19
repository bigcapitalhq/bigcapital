import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import {
  IManualJournal,
  IManualJournalEventDeletedPayload,
  IManualJournalDeletingPayload,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export class DeleteManualJournal {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Deletes the given manual journal
   * @param {number} tenantId
   * @param {number} manualJournalId
   * @return {Promise<void>}
   */
  public deleteManualJournal = async (
    tenantId: number,
    manualJournalId: number
  ): Promise<{
    oldManualJournal: IManualJournal;
  }> => {
    const { ManualJournal, ManualJournalEntry } = this.tenancy.models(tenantId);

    // Validate the manual journal exists on the storage.
    const oldManualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .throwIfNotFound();

    // Deletes the manual journal with associated transactions under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onManualJournalDeleting` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onDeleting, {
        tenantId,
        oldManualJournal,
        trx,
      } as IManualJournalDeletingPayload);

      // Deletes the manual journal entries.
      await ManualJournalEntry.query(trx)
        .where('manualJournalId', manualJournalId)
        .delete();

      // Deletes the manual journal transaction.
      await ManualJournal.query(trx).findById(manualJournalId).delete();

      // Triggers `onManualJournalDeleted` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onDeleted, {
        tenantId,
        manualJournalId,
        oldManualJournal,
        trx,
      } as IManualJournalEventDeletedPayload);

      return { oldManualJournal };
    });
  };
}
