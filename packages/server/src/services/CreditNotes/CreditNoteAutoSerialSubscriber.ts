import { ICreditNoteCreatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import BaseCreditNotes from './CreditNotes';

@Service()
export default class CreditNoteAutoSerialSubscriber {
  @Inject()
  creditNotesService: BaseCreditNotes;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.creditNote.onCreated, this.autoSerialIncrementOnceCreated);
  }

  /**
   * Auto serial increment once credit note created.
   * @param {ICreditNoteCreatedPayload} payload -
   */
  private autoSerialIncrementOnceCreated = async ({ tenantId }: ICreditNoteCreatedPayload) => {
    await this.creditNotesService.incrementSerialNumber(tenantId);
  };
}
