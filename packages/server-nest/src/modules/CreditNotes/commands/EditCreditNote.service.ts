import { Inject, Injectable } from '@nestjs/common';
import {
  ICreditNoteEditedPayload,
  ICreditNoteEditingPayload,
} from '../types/CreditNotes.types';
import { Knex } from 'knex';
import { CreditNote } from '../models/CreditNote';
import { Contact } from '../../Contacts/models/Contact';
import { ItemsEntriesService } from '../../Items/ItemsEntries.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { CommandCreditNoteDTOTransform } from './CommandCreditNoteDTOTransform.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditCreditNoteDto } from '../dtos/CreditNote.dto';

@Injectable()
export class EditCreditNoteService {
  /**
   * @param {typeof CreditNote} creditNoteModel - The credit note model.
   * @param {typeof Contact} contactModel - The contact model.
   * @param {CommandCreditNoteDTOTransform} commandCreditNoteDTOTransform - The command credit note DTO transform service.
   * @param {ItemsEntriesService} itemsEntriesService - The items entries service.
   * @param {EventEmitter2} eventPublisher - The event publisher.
   * @param {UnitOfWork} uow - The unit of work.
   */
  constructor(
    @Inject(CreditNote.name)
    private creditNoteModel: TenantModelProxy<typeof CreditNote>,

    @Inject(Contact.name)
    private contactModel: TenantModelProxy<typeof Contact>,

    private commandCreditNoteDTOTransform: CommandCreditNoteDTOTransform,
    private itemsEntriesService: ItemsEntriesService,
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,
  ) {}

  /**
   * Edits the given credit note.
   * @param {ICreditNoteEditDTO} creditNoteEditDTO -
   */
  public async editCreditNote(
    creditNoteId: number,
    creditNoteEditDTO: EditCreditNoteDto,
  ) {
    // Retrieve the sale invoice or throw not found service error.
    const oldCreditNote = await this.creditNoteModel()
      .query()
      .findById(creditNoteId)
      .throwIfNotFound();

    // Validate customer existance.
    const customer = await this.contactModel()
      .query()
      .findById(creditNoteEditDTO.customerId);

    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(
      creditNoteEditDTO.entries,
    );
    // Validate non-sellable entries items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      creditNoteEditDTO.entries,
    );
    // Validate the items entries existance.
    await this.itemsEntriesService.validateEntriesIdsExistance(
      creditNoteId,
      'CreditNote',
      creditNoteEditDTO.entries,
    );
    // Transformes the given DTO to storage layer data.
    const creditNoteModel =
      await this.commandCreditNoteDTOTransform.transformCreateEditDTOToModel(
        creditNoteEditDTO,
        customer.currencyCode,
        oldCreditNote,
      );
    // Sales the credit note transactions with associated entries.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onCreditNoteEditing` event.
      await this.eventPublisher.emitAsync(events.creditNote.onEditing, {
        creditNoteEditDTO,
        oldCreditNote,
        trx,
      } as ICreditNoteEditingPayload);

      // Saves the credit note graph to the storage.
      const creditNote = await this.creditNoteModel()
        .query(trx)
        .upsertGraph({
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
      } as ICreditNoteEditedPayload);

      return creditNote;
    });
  }
}
