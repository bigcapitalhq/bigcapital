import {
  IManualJournalEventCreatedPayload,
  IManualJournalEventDeletedPayload,
  IManualJournalEventEditedPayload,
  IManualJournalEventPublishedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { EventSubscriber } from 'event-dispatch';
import { Inject } from 'typedi';
import { AutoIncrementManualJournal } from './AutoIncrementManualJournal';
import { ManualJournalGLEntries } from './ManualJournalGLEntries';

@EventSubscriber()
export class ManualJournalWriteGLSubscriber {
  @Inject()
  private manualJournalGLEntries: ManualJournalGLEntries;

  @Inject()
  private manualJournalAutoIncrement: AutoIncrementManualJournal;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(events.manualJournals.onCreated, this.handleWriteJournalEntriesOnCreated);
    bus.subscribe(events.manualJournals.onCreated, this.handleJournalNumberIncrement);
    bus.subscribe(events.manualJournals.onEdited, this.handleRewriteJournalEntriesOnEdited);
    bus.subscribe(events.manualJournals.onPublished, this.handleWriteJournalEntriesOnPublished);
    bus.subscribe(events.manualJournals.onDeleted, this.handleRevertJournalEntries);
  }

  /**
   * Handle manual journal created event.
   * @param {IManualJournalEventCreatedPayload} payload -
   * @returns {Promise<void>}
   */
  private handleWriteJournalEntriesOnCreated = async ({
    tenantId,
    manualJournal,
    trx,
  }: IManualJournalEventCreatedPayload) => {
    // Ingore writing manual journal journal entries in case was not published.
    if (!manualJournal.publishedAt) return;

    await this.manualJournalGLEntries.createManualJournalGLEntries(tenantId, manualJournal.id, trx);
  };

  /**
   * Handles the manual journal next number increment once the journal be created.
   * @param {IManualJournalEventCreatedPayload} payload -
   * @return {Promise<void>}
   */
  private handleJournalNumberIncrement = async ({ tenantId }: IManualJournalEventCreatedPayload) => {
    await this.manualJournalAutoIncrement.incrementNextJournalNumber(tenantId);
  };

  /**
   * Handle manual journal edited event.
   * @param {IManualJournalEventEditedPayload}
   * @return {Promise<void>}
   */
  private handleRewriteJournalEntriesOnEdited = async ({
    tenantId,
    manualJournal,
    oldManualJournal,
    trx,
  }: IManualJournalEventEditedPayload) => {
    if (manualJournal.publishedAt) {
      await this.manualJournalGLEntries.editManualJournalGLEntries(tenantId, manualJournal.id, trx);
    }
  };

  /**
   * Handles writing journal entries once the manula journal publish.
   * @param {IManualJournalEventPublishedPayload} payload -
   * @return {Promise<void>}
   */
  private handleWriteJournalEntriesOnPublished = async ({
    tenantId,
    manualJournal,
    trx,
  }: IManualJournalEventPublishedPayload) => {
    await this.manualJournalGLEntries.createManualJournalGLEntries(tenantId, manualJournal.id, trx);
  };

  /**
   * Handle manual journal deleted event.
   * @param {IManualJournalEventDeletedPayload} payload -
   */
  private handleRevertJournalEntries = async ({
    tenantId,
    manualJournalId,
    trx,
  }: IManualJournalEventDeletedPayload) => {
    await this.manualJournalGLEntries.revertManualJournalGLEntries(tenantId, manualJournalId, trx);
  };
}
