import {
  ICreditNoteEditDTO,
  ICreditNoteEditedPayload,
  ICreditNoteEditingPayload,
} from '@/interfaces';
import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import BaseCreditNotes from './CreditNotes';

@Service()
export default class EditCreditNote extends BaseCreditNotes {
  @Inject()
  itemsEntriesService: ItemsEntriesService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  uow: UnitOfWork;

  /**
   * Edits the given credit note.
   * @param {number} tenantId -
   * @param {ICreditNoteEditDTO} creditNoteEditDTO -
   */
  public editCreditNote = async (
    tenantId: number,
    creditNoteId: number,
    creditNoteEditDTO: ICreditNoteEditDTO
  ) => {
    const { CreditNote, Contact } = this.tenancy.models(tenantId);

    // Retrieve the sale invoice or throw not found service error.
    const oldCreditNote = await this.getCreditNoteOrThrowError(
      tenantId,
      creditNoteId
    );
    // Validate customer existence.
    const customer = await Contact.query()
      .modify('customer')
      .findById(creditNoteEditDTO.customerId)
      .throwIfNotFound();

    // Validate items ids existence.
    await this.itemsEntriesService.validateItemsIdsExistence(
      tenantId,
      creditNoteEditDTO.entries
    );
    // Validate non-sellable entries items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      creditNoteEditDTO.entries
    );
    // Validate the items entries existence.
    await this.itemsEntriesService.validateEntriesIdsExistence(
      tenantId,
      creditNoteId,
      'CreditNote',
      creditNoteEditDTO.entries
    );
    // Transformes the given DTO to storage layer data.
    const creditNoteModel = this.transformCreateEditDTOToModel(
      tenantId,
      creditNoteEditDTO,
      customer.currencyCode,
      oldCreditNote
    );
    // Sales the credit note transactions with associated entries.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCreditNoteEditing` event.
      await this.eventPublisher.emitAsync(events.creditNote.onEditing, {
        creditNoteEditDTO,
        oldCreditNote,
        trx,
        tenantId,
      } as ICreditNoteEditingPayload);

      // Saves the credit note graph to the storage.
      const creditNote = await CreditNote.query(trx).upsertGraph({
        id: creditNoteId,
        ...creditNoteModel,
      });
      // Triggers `onCreditNoteEdited` event.
      await this.eventPublisher.emitAsync(events.creditNote.onEdited, {
        trx,
        oldCreditNote,
        creditNoteId,
        creditNote,
        creditNoteEditDTO,
        tenantId,
      } as ICreditNoteEditedPayload);

      return creditNote;
    });
  };
}
