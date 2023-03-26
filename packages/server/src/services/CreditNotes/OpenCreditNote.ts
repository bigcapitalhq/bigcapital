import { ServiceError } from '@/exceptions';
import {
  ICreditNote,
  ICreditNoteOpenedPayload,
  ICreditNoteOpeningPayload,
} from '@/interfaces';
import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import BaseCreditNotes from './CreditNotes';
import { ERRORS } from './constants';

@Service()
export default class OpenCreditNote extends BaseCreditNotes {
  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Opens the given credit note.
   * @param {number} tenantId -
   * @param {ICreditNoteEditDTO} creditNoteEditDTO -
   * @returns {Promise<ICreditNote>}
   */
  public openCreditNote = async (
    tenantId: number,
    creditNoteId: number
  ): Promise<ICreditNote> => {
    const { CreditNote } = this.tenancy.models(tenantId);

    // Retrieve the sale invoice or throw not found service error.
    const oldCreditNote = await this.getCreditNoteOrThrowError(
      tenantId,
      creditNoteId
    );
    // Throw service error if the credit note is already open.
    this.throwErrorIfAlreadyOpen(oldCreditNote);

    // Triggers `onCreditNoteOpen` event.
    this.eventPublisher.emitAsync(events.creditNote.onOpen, {
      tenantId,
      creditNoteId,
      oldCreditNote,
    });
    // Sales the credit note transactions with associated entries.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      const eventPayload = {
        tenantId,
        creditNoteId,
        oldCreditNote,
        trx,
      } as ICreditNoteOpeningPayload;

      // Triggers `onCreditNoteOpening` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onOpening,
        eventPayload
      );
      // Saves the credit note graph to the storage.
      const creditNote = await CreditNote.query(trx)
        .findById(creditNoteId)
        .update({
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
   *
   * @param creditNote
   */
  public throwErrorIfAlreadyOpen = (creditNote) => {
    if (creditNote.openedAt) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_ALREADY_OPENED);
    }
  };
}
