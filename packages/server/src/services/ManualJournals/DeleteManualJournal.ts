import { IManualJournal, IManualJournalDeletingPayload, IManualJournalEventDeletedPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import TenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

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
    manualJournalId: number,
  ): Promise<{
    oldManualJournal: IManualJournal;
  }> => {
    const { ManualJournal, ManualJournalEntry } = this.tenancy.models(tenantId);

    // Validate the manual journal exists on the storage.
    const oldManualJournal = await ManualJournal.query().findById(manualJournalId).throwIfNotFound();

    // Deletes the manual journal with associated transactions under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onManualJournalDeleting` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onDeleting, {
        tenantId,
        oldManualJournal,
        trx,
      } as IManualJournalDeletingPayload);

      // Deletes the manual journal entries.
      await ManualJournalEntry.query(trx).where('manualJournalId', manualJournalId).delete();

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
