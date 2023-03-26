import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import BaseCreditNotes from './CreditNotes';
import { ICreditNoteCreatedPayload } from '@/interfaces';

@Service()
export default class CreditNoteAutoSerialSubscriber {
  @Inject()
  creditNotesService: BaseCreditNotes;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.creditNote.onCreated,
      this.autoSerialIncrementOnceCreated
    );
  }

  /**
   * Auto serial increment once credit note created.
   * @param {ICreditNoteCreatedPayload} payload - 
   */
  private autoSerialIncrementOnceCreated = async ({
    tenantId,
  }: ICreditNoteCreatedPayload) => {
    await this.creditNotesService.incrementSerialNumber(tenantId);
  };
}
