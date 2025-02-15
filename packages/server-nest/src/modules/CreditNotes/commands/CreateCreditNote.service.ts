import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import {
  ICreditNoteCreatedPayload,
  ICreditNoteCreatingPayload,
  ICreditNoteNewDTO,
} from '../types/CreditNotes.types';
import { CreditNote } from '../models/CreditNote';
import { Contact } from '../../Contacts/models/Contact';
import { CommandCreditNoteDTOTransform } from './CommandCreditNoteDTOTransform.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CreateCreditNoteService {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {ItemsEntriesService} itemsEntriesService - Items entries service.
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {typeof CreditNote} creditNoteModel - Credit note model.
   * @param {typeof Contact} contactModel - Contact model.
   * @param {CommandCreditNoteDTOTransform} commandCreditNoteDTOTransform - Command credit note DTO transform service.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly eventPublisher: EventEmitter2,
    private readonly commandCreditNoteDTOTransform: CommandCreditNoteDTOTransform,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: TenantModelProxy<typeof CreditNote>,

    @Inject(Contact.name)
    private readonly contactModel: TenantModelProxy<typeof Contact>,
  ) {}

  /**
   * Creates a new credit note.
   * @param creditNoteDTO
   */
  public creditCreditNote = async (
    creditNoteDTO: ICreditNoteNewDTO,
    trx?: Knex.Transaction,
  ) => {
    // Triggers `onCreditNoteCreate` event.
    await this.eventPublisher.emitAsync(events.creditNote.onCreate, {
      creditNoteDTO,
    });
    // Validate customer existance.
    const customer = await this.contactModel()
      .query()
      .modify('customer')
      .findById(creditNoteDTO.customerId)
      .throwIfNotFound();

    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(
      creditNoteDTO.entries,
    );
    // Validate items should be sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      creditNoteDTO.entries,
    );
    // Transformes the given DTO to storage layer data.
    const creditNoteModel =
      await this.commandCreditNoteDTOTransform.transformCreateEditDTOToModel(
        creditNoteDTO,
        customer.currencyCode,
      );
    // Creates a new credit card transactions under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onCreditNoteCreating` event.
      await this.eventPublisher.emitAsync(events.creditNote.onCreating, {
        creditNoteDTO,
        trx,
      } as ICreditNoteCreatingPayload);

      // Upsert the credit note graph.
      const creditNote = await this.creditNoteModel()
        .query(trx)
        .upsertGraph({
          ...creditNoteModel,
        });
      // Triggers `onCreditNoteCreated` event.
      await this.eventPublisher.emitAsync(events.creditNote.onCreated, {
        creditNoteDTO,
        creditNote,
        creditNoteId: creditNote.id,
        trx,
      } as ICreditNoteCreatedPayload);

      return creditNote;
    }, trx);
  };
}
