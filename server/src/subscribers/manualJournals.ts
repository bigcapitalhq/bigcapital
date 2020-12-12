import { Inject, Container } from 'typedi';
import { On, EventSubscriber } from "event-dispatch";
import events from 'subscribers/events';
import SettingsService from 'services/Settings/SettingsService';
import ManualJournalsService from 'services/ManualJournals/ManualJournalsService';

@EventSubscriber()
export class ManualJournalSubscriber {
  logger: any;
  settingsService: SettingsService;

  constructor() {
    this.logger = Container.get('logger');
    this.settingsService = Container.get(SettingsService);
  }

  /**
   * Handle manual journal created event.
   * @param {{ tenantId: number, manualJournal: IManualJournal }} 
   */
  @On(events.manualJournals.onCreated)
  public async handleWriteJournalEntries({ tenantId, manualJournal }) {
    const manualJournalsService = Container.get(ManualJournalsService);

    await manualJournalsService
      .writeJournalEntries(tenantId, manualJournal.id, manualJournal);
  }

  /**
   * Handle manual journal edited event.
   * @param {{ tenantId: number, manualJournal: IManualJournal }} 
   */
  @On(events.manualJournals.onEdited)
  public async handleRewriteJournalEntries({ tenantId, manualJournal }) {
    const manualJournalsService = Container.get(ManualJournalsService);

    await manualJournalsService
      .writeJournalEntries(tenantId, manualJournal.id, manualJournal, true);
  }

  /**
   * Handle manual journal deleted event.
   * @param {{ tenantId: number, manualJournalId: number }}
   */
  @On(events.manualJournals.onDeleted)
  public async handleRevertJournalEntries({ tenantId, manualJournalId, }) {
    const manualJournalsService = Container.get(ManualJournalsService);

    await manualJournalsService
      .writeJournalEntries(tenantId, manualJournalId, null, true);
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