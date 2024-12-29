import {
  ICreditNoteOpenedPayload,
  ICreditNoteOpeningPayload,
} from '../types/CreditNotes.types';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { CreditNote } from '../models/CreditNote';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class OpenCreditNoteService {
  /**
   * @param {EventEmitter2} eventPublisher - The event publisher.
   * @param {UnitOfWork} uow - The unit of work.
   * @param {typeof CreditNote} creditNoteModel - The credit note model.
   */
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: typeof CreditNote,
  ) {}

  /**
   * Opens the given credit note.
   * @param {number} creditNoteId -
   * @returns {Promise<CreditNote>}
   */
  public openCreditNote = async (creditNoteId: number): Promise<CreditNote> => {
    // Retrieve the sale invoice or throw not found service error.
    const oldCreditNote = await this.creditNoteModel
      .query()
      .findById(creditNoteId)
      .throwIfNotFound();

    // Throw service error if the credit note is already open.
    this.throwErrorIfAlreadyOpen(oldCreditNote);

    // Triggers `onCreditNoteOpen` event.
    this.eventPublisher.emitAsync(events.creditNote.onOpen, {
      creditNoteId,
      oldCreditNote,
    });
    // Sales the credit note transactions with associated entries.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const eventPayload = {
        oldCreditNote,
        trx,
      } as ICreditNoteOpeningPayload;

      // Triggers `onCreditNoteOpening` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onOpening,
        eventPayload,
      );
      // Saves the credit note graph to the storage.
      const creditNote = await this.creditNoteModel
        .query(trx)
        .updateAndFetchById(creditNoteId, {
          openedAt: new Date(),
        });
      // Triggers `onCreditNoteOpened` event.
      await this.eventPublisher.emitAsync(events.creditNote.onOpened, {
        ...eventPayload,
        creditNote,
      } as ICreditNoteOpenedPayload);

      return creditNote;
    });
  };

  /**
   * Throws an error if the given credit note is already open.
   * @param {CreditNote} creditNote -
   */
  public throwErrorIfAlreadyOpen = (creditNote: CreditNote) => {
    if (creditNote.openedAt) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_ALREADY_OPENED);
    }
  };
}
