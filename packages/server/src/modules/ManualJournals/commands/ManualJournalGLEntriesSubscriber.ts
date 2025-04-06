import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  IManualJournalEventCreatedPayload,
  IManualJournalEventEditedPayload,
  IManualJournalEventPublishedPayload,
  IManualJournalEventDeletedPayload,
} from '../types/ManualJournals.types';
import { ManualJournalGLEntries } from './ManualJournalGLEntries';
import { AutoIncrementManualJournal } from './AutoIncrementManualJournal.service';
import { events } from '@/common/events/events';

@Injectable()
export class ManualJournalWriteGLSubscriber {
  /**
   * @param {ManualJournalGLEntries} manualJournalGLEntries - The manual journal GL entries service.
   * @param {AutoIncrementManualJournal} manualJournalAutoIncrement - The manual journal auto increment service.
   */
  constructor(
    private manualJournalGLEntries: ManualJournalGLEntries,
    private manualJournalAutoIncrement: AutoIncrementManualJournal,
  ) {}

  /**
   * Handle manual journal created event.
   * @param {IManualJournalEventCreatedPayload} payload -
   * @returns {Promise<void>}
   */
  @OnEvent(events.manualJournals.onCreated)
  public async handleWriteJournalEntriesOnCreated({
    manualJournal,
    trx,
  }: IManualJournalEventCreatedPayload) {
    // Ingore writing manual journal journal entries in case was not published.
    if (!manualJournal.publishedAt) return;

    await this.manualJournalGLEntries.createManualJournalGLEntries(
      manualJournal.id,
      trx,
    );
  }

  /**
   * Handles the manual journal next number increment once the journal be created.
   * @param {IManualJournalEventCreatedPayload} payload -
   * @return {Promise<void>}
   */
  @OnEvent(events.manualJournals.onCreated)
  public async handleJournalNumberIncrement({}: IManualJournalEventCreatedPayload) {
    await this.manualJournalAutoIncrement.incrementNextJournalNumber();
  }

  /**
   * Handle manual journal edited event.
   * @param {IManualJournalEventEditedPayload}
   * @return {Promise<void>}
   */
  @OnEvent(events.manualJournals.onEdited)
  public async handleRewriteJournalEntriesOnEdited({
    manualJournal,
    oldManualJournal,
    trx,
  }: IManualJournalEventEditedPayload) {
    if (manualJournal.publishedAt) {
      await this.manualJournalGLEntries.editManualJournalGLEntries(
        manualJournal.id,
        trx,
      );
    }
  }

  /**
   * Handles writing journal entries once the manula journal publish.
   * @param {IManualJournalEventPublishedPayload} payload -
   * @return {Promise<void>}
   */
  @OnEvent(events.manualJournals.onPublished)
  public async handleWriteJournalEntriesOnPublished({
    manualJournal,
    trx,
  }: IManualJournalEventPublishedPayload) {
    await this.manualJournalGLEntries.createManualJournalGLEntries(
      manualJournal.id,
      trx,
    );
  }

  /**
   * Handle manual journal deleted event.
   * @param {IManualJournalEventDeletedPayload} payload -
   */
  @OnEvent(events.manualJournals.onDeleted)
  public async handleRevertJournalEntries({
    manualJournalId,
    trx,
  }: IManualJournalEventDeletedPayload) {
    await this.manualJournalGLEntries.revertManualJournalGLEntries(
      manualJournalId,
      trx,
    );
  }
}
