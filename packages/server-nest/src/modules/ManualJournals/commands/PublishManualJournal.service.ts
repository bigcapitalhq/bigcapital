import * as moment from 'moment';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IManualJournalEventPublishedPayload,
  IManualJournalPublishingPayload,
} from '../types/ManualJournals.types';
import { CommandManualJournalValidators } from './CommandManualJournalValidators.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ManualJournal } from '../models/ManualJournal';
import { events } from '@/common/events/events';

@Injectable()
export class PublishManualJournal {
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,
    private validator: CommandManualJournalValidators,

    @Inject(ManualJournal.name)
    private manualJournalModel: typeof ManualJournal,
  ) {}

  /**
   * Authorize the manual journal publishing.
   * @param {number} manualJournalId - Manual journal id.
   */
  private authorize = (oldManualJournal: ManualJournal) => {
    // Validate the manual journal is not published.
    this.validator.validateManualJournalIsNotPublished(oldManualJournal);
  };

  /**
   * Publish the given manual journal.
   * @param {number} manualJournalId - Manual journal id.
   */
  public async publishManualJournal(manualJournalId: number): Promise<void> {
    // Find the old manual journal or throw not found error.
    const oldManualJournal = await this.manualJournalModel
      .query()
      .findById(manualJournalId)
      .throwIfNotFound();

    // Authorize the manual journal publishing.
    await this.authorize(oldManualJournal);

    // Publishes the manual journal with associated transactions.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onManualJournalPublishing` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onPublishing, {
        oldManualJournal,
        trx,
      } as IManualJournalPublishingPayload);

      // Mark the given manual journal as published.
      await this.manualJournalModel.query(trx).findById(manualJournalId).patch({
        publishedAt: moment().toMySqlDateTime(),
      });
      // Retrieve the manual journal with enrties after modification.
      const manualJournal = await this.manualJournalModel.query()
        .findById(manualJournalId)
        .withGraphFetched('entries');

      // Triggers `onManualJournalPublishedBulk` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onPublished, {
        manualJournal,
        oldManualJournal,
        trx,
      } as IManualJournalEventPublishedPayload);
    });
  }
}
