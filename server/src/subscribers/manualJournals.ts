import { Inject, Container } from 'typedi';
import { On, EventSubscriber } from 'event-dispatch';
import events from 'subscribers/events';
import SettingsService from 'services/Settings/SettingsService';
import ManualJournalsService from 'services/ManualJournals/ManualJournalsService';

@EventSubscriber()
export class ManualJournalSubscriber {
  logger: any;
  settingsService: SettingsService;
  manualJournalsService: ManualJournalsService;

  constructor() {
    this.logger = Container.get('logger');
    this.settingsService = Container.get(SettingsService);
    this.manualJournalsService = Container.get(ManualJournalsService);
  }

  /**
   * Handle manual journal created event.
   */
  @On(events.manualJournals.onCreated)
  public async handleWriteJournalEntriesOnCreated({ tenantId, manualJournal }) {
    // Ingore writing manual journal journal entries in case was not published.
    if (manualJournal.publishedAt) {
      await this.manualJournalsService.writeJournalEntries(
        tenantId, 
        manualJournal
      );
    }
  }

  /**
   * Handle manual journal edited event.
   */
  @On(events.manualJournals.onEdited)
  public async handleRewriteJournalEntriesOnEdited({
    tenantId,
    manualJournal,
    oldManualJournal,
  }) {
    if (manualJournal.publishedAt) {
      await this.manualJournalsService.writeJournalEntries(
        tenantId,
        manualJournal,
        true
      );
    }
  }

  /**
   * Handles writing journal entries once the manula journal publish.
   */
  @On(events.manualJournals.onPublished)
  public async handleWriteJournalEntriesOnPublished({
    tenantId,
    manualJournal,
  }) {
    await this.manualJournalsService.writeJournalEntries(
      tenantId,
      manualJournal
    );
  }

  /**
   * Handle manual journal deleted event.
   */
  @On(events.manualJournals.onDeleted)
  public async handleRevertJournalEntries({
    tenantId,
    manualJournalId,
    oldManualJournal,
  }) {
    await this.manualJournalsService.revertJournalEntries(
      tenantId,
      manualJournalId
    );
  }

  /**
   * Handles the writing journal entries once the manual journals bulk published.
   */
  @On(events.manualJournals.onPublishedBulk)
  public async handleWritingJournalEntriesOnBulkPublish({
    tenantId,
    oldManualJournals,
  }) {
    const notPublishedJournals = this.manualJournalsService.getNonePublishedManualJournals(
      oldManualJournals
    );
    await this.manualJournalsService.writeJournalEntries(
      tenantId,
      notPublishedJournals
    );
  }

  /**
   * Handles revert journal entries once manual journals bulk delete.
   */
  @On(events.manualJournals.onDeletedBulk)
  public async handleRevertJournalEntriesOnBulkDelete({
    tenantId,
    manualJournalsIds,
  }) {
    await this.manualJournalsService.revertJournalEntries(
      tenantId,
      manualJournalsIds
    );
  }

  /**
   * Handle increment next number of manual journal once be created.
   */
  @On(events.manualJournals.onCreated)
  public async handleJournalNextNumberIncrement({ tenantId }) {
    const query = {
      group: 'manual_journals',
      key: 'next_number',
    };
    await this.settingsService.incrementNextNumber(tenantId, query);
  }
}
