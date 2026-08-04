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
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class PublishManualJournal {
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,
    private validator: CommandManualJournalValidators,

    @Inject(ManualJournal.name)
    private manualJournalModel: TenantModelProxy<typeof ManualJournal>,
  ) {}

  /**
   * Validates the publish manual journal operation against the locked manual
   * journal row: existence and not already published.
   * @param {number} manualJournalId - Manual journal id.
   * @param {Knex.Transaction} trx - Locks the manual journal row (FOR UPDATE).
   * @returns {Promise<ManualJournal>} The locked manual journal.
   */
  async validate(
    manualJournalId: number,
    trx: Knex.Transaction,
  ): Promise<ManualJournal> {
    // Find the old manual journal with a row lock or throw not found error.
    const oldManualJournal = await this.manualJournalModel()
      .query(trx)
      .findById(manualJournalId)
      .forUpdate()
      .throwIfNotFound();

    // Validate the manual journal is not published against the locked row.
    this.validator.validateManualJournalIsNotPublished(oldManualJournal);
    return oldManualJournal;
  }

  /**
   * Publish the given manual journal.
   * @param {number} manualJournalId - Manual journal id.
   */
  public async publishManualJournal(manualJournalId: number): Promise<void> {
    // Publishes the manual journal with associated transactions.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the publish operation against the locked manual journal row.
      const oldManualJournal = await this.validate(manualJournalId, trx);

      // Triggers `onManualJournalPublishing` event.
      await this.eventPublisher.emitAsync(events.manualJournals.onPublishing, {
        oldManualJournal,
        trx,
      } as IManualJournalPublishingPayload);

      // Mark the given manual journal as published.
      await this.manualJournalModel()
        .query(trx)
        .findById(manualJournalId)
        .patch({
          publishedAt: moment().toMySqlDateTime(),
        });
      // Retrieve the manual journal with enrties after modification.
      const manualJournal = await this.manualJournalModel()
        .query(trx)
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
