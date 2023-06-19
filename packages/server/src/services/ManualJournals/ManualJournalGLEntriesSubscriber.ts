import { Inject } from 'typedi';
import { EventSubscriber } from 'event-dispatch';
import {
  IManualJournalEventCreatedPayload,
  IManualJournalEventEditedPayload,
  IManualJournalEventPublishedPayload,
  IManualJournalEventDeletedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { ManualJournalGLEntries } from './ManualJournalGLEntries';
import { AutoIncrementManualJournal } from './AutoIncrementManualJournal';

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
    bus.subscribe(
      events.manualJournals.onCreated,
      this.handleWriteJournalEntriesOnCreated
    );
    bus.subscribe(
      events.manualJournals.onCreated,
      this.handleJournalNumberIncrement
    );
    bus.subscribe(
      events.manualJournals.onEdited,
      this.handleRewriteJournalEntriesOnEdited
    );
    bus.subscribe(
      events.manualJournals.onPublished,
      this.handleWriteJournalEntriesOnPublished
    );
    bus.subscribe(
      events.manualJournals.onDeleted,
      this.handleRevertJournalEntries
    );
  }

  /**
   * Handle manual journal created event.
   * @param {IManualJournalEventCreatedPayload} payload -
   */
  private handleWriteJournalEntriesOnCreated = async ({
    tenantId,
    manualJournal,
    trx,
  }: IManualJournalEventCreatedPayload) => {
    // Ignore writing manual journal entries in case was not published.
    if (manualJournal.publishedAt) {
      await this.manualJournalGLEntries.createManualJournalGLEntries(
        tenantId,
        manualJournal.id,
        trx
      );
    }
  };

  /**
   * Handles the manual journal next number increment once the journal be created.
   * @param {IManualJournalEventCreatedPayload} payload -
   */
  private handleJournalNumberIncrement = async ({
    tenantId,
  }: IManualJournalEventCreatedPayload) => {
    await this.manualJournalAutoIncrement.incrementNextJournalNumber(tenantId);
  };

  /**
   * Handle manual journal edited event.
   * @param {IManualJournalEventEditedPayload}
   */
  private handleRewriteJournalEntriesOnEdited = async ({
    tenantId,
    manualJournal,
    oldManualJournal,
    trx,
  }: IManualJournalEventEditedPayload) => {
    if (manualJournal.publishedAt) {
      await this.manualJournalGLEntries.editManualJournalGLEntries(
        tenantId,
        manualJournal.id,
        trx
      );
    }
  };

  /**
   * Handles writing journal entries once the manual journal publish.
   * @param {IManualJournalEventPublishedPayload} payload -
   */
  private handleWriteJournalEntriesOnPublished = async ({
    tenantId,
    manualJournal,
    trx,
  }: IManualJournalEventPublishedPayload) => {
    await this.manualJournalGLEntries.createManualJournalGLEntries(
      tenantId,
      manualJournal.id,
      trx
    );
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
    await this.manualJournalGLEntries.revertManualJournalGLEntries(
      tenantId,
      manualJournalId,
      trx
    );
  };
}
