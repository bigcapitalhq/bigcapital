import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreditNoteAutoIncrementService } from '../commands/CreditNoteAutoIncrement.service';
import { ICreditNoteCreatedPayload } from '../types/CreditNotes.types';
import { events } from '@/common/events/events';

@Injectable()
export class CreditNoteAutoSerialSubscriber {
  constructor(
    private readonly creditNoteIncrementService: CreditNoteAutoIncrementService,
  ) { }

  /**
   * Auto serial increment once credit note created.
   * @param {ICreditNoteCreatedPayload} payload -
   */
  @OnEvent(events.creditNote.onCreated)
  async autoSerialIncrementOnceCreated({ }: ICreditNoteCreatedPayload) {
    await this.creditNoteIncrementService.incrementSerialNumber();
  }
}
