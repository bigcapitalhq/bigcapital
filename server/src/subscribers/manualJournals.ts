import { Inject, Container } from 'typedi';
import { On, EventSubscriber } from "event-dispatch";
import events from 'subscribers/events';
import ManualJournalsService from 'services/ManualJournals/ManualJournalsService';

@EventSubscriber()
export class ManualJournalSubscriber {
  /**
   * Handle manual journal created event.
   * @param {{ tenantId: number, manualJournal: IManualJournal }} 
   */
  @On(events.manualJournals.onCreated)
  public async onManualJournalCreated({ tenantId, manualJournal }) {
    const manualJournalsService = Container.get(ManualJournalsService);

    await manualJournalsService
      .writeJournalEntries(tenantId, manualJournal.id, manualJournal);
  }

  /**
   * Handle manual journal edited event.
   * @param {{ tenantId: number, manualJournal: IManualJournal }} 
   */
  @On(events.manualJournals.onEdited)
  public async onManualJournalEdited({ tenantId, manualJournal }) {
    const manualJournalsService = Container.get(ManualJournalsService);

    await manualJournalsService
      .writeJournalEntries(tenantId, manualJournal.id, manualJournal, true);
  }

  /**
   * Handle manual journal deleted event.
   * @param {{ tenantId: number, manualJournalId: number }}
   */
  @On(events.manualJournals.onDeleted)
  public async onManualJournalDeleted({ tenantId, manualJournalId, }) {
    const manualJournalsService = Container.get(ManualJournalsService);

    await manualJournalsService
      .writeJournalEntries(tenantId, manualJournalId, null, true);
  }
}