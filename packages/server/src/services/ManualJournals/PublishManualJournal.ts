import { Service, Inject } from 'typedi';
import moment from 'moment';
import { Knex } from 'knex';
import {
  IManualJournal,
  IManualJournalEventPublishedPayload,
  IManualJournalPublishingPayload,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';

import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { CommandManualJournalValidators } from './CommandManualJournalValidators';

@Service()
export class PublishManualJournal {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validator: CommandManualJournalValidators;

  /**
   * Authorize the manual journal publishing.
   * @param {number} tenantId
   * @param {number} manualJournalId
   */
  private authorize = (tenantId: number, oldManualJournal: IManualJournal) => {
    // Validate the manual journal is not published.
    this.validator.validateManualJournalIsNotPublished(oldManualJournal);
  };

  /**
   * Publish the given manual journal.
   * @param {number} tenantId - Tenant id.
   * @param {number} manualJournalId - Manual journal id.
   */
  public async publishManualJournal(
    tenantId: number,
    manualJournalId: number
  ): Promise<void> {
    const { ManualJournal } = this.tenancy.models(tenantId);

    // Find the old manual journal or throw not found error.
    const oldManualJournal = await ManualJournal.query()
      .findById(manualJournalId)
      .throwIfNotFound();

    // Authorize the manual journal publishing.
    await this.authorize(tenantId, oldManualJournal);

    // Publishes the manual journal with associated transactions.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onManualJournalPublishing` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onPublishing, {
        oldManualJournal,
        trx,
        tenantId,
      } as IManualJournalPublishingPayload);

      // Mark the given manual journal as published.
      await ManualJournal.query(trx).findById(manualJournalId).patch({
        publishedAt: moment().toMySqlDateTime(),
      });
      // Retrieve the manual journal with entries after modification.
      const manualJournal = await ManualJournal.query()
        .findById(manualJournalId)
        .withGraphFetched('entries');

      // Triggers `onManualJournalPublishedBulk` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onPublished, {
        tenantId,
        manualJournal,
        manualJournalId,
        oldManualJournal,
        trx,
      } as IManualJournalEventPublishedPayload);
    });
  }
}
