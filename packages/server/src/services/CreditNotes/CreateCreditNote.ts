import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import {
  ICreditNoteCreatedPayload,
  ICreditNoteCreatingPayload,
  ICreditNoteNewDTO,
  ISystemUser,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import BaseCreditNotes from './CreditNotes';

@Service()
export default class CreateCreditNote extends BaseCreditNotes {
  @Inject()
  uow: UnitOfWork;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Creates a new credit note.
   * @param creditNoteDTO
   */
  public newCreditNote = async (
    tenantId: number,
    creditNoteDTO: ICreditNoteNewDTO,
    authorizedUser: ISystemUser
  ) => {
    const { CreditNote, Contact } = this.tenancy.models(tenantId);

    // Triggers `onCreditNoteCreate` event.
    await this.eventPublisher.emitAsync(events.creditNote.onCreate, {
      tenantId,
      creditNoteDTO,
    });
    // Validate customer existence.
    const customer = await Contact.query()
      .modify('customer')
      .findById(creditNoteDTO.customerId)
      .throwIfNotFound();

    // Validate items ids existence.
    await this.itemsEntriesService.validateItemsIdsExistence(
      tenantId,
      creditNoteDTO.entries
    );
    // Validate items should be sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      creditNoteDTO.entries
    );
    // Transformes the given DTO to storage layer data.
    const creditNoteModel = this.transformCreateEditDTOToModel(
      tenantId,
      creditNoteDTO,
      customer.currencyCode
    );
    // Creates a new credit card transactions under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCreditNoteCreating` event.
      await this.eventPublisher.emitAsync(events.creditNote.onCreating, {
        tenantId,
        creditNoteDTO,
        trx,
      } as ICreditNoteCreatingPayload);

      // Upsert the credit note graph.
      const creditNote = await CreditNote.query(trx).upsertGraph({
        ...creditNoteModel,
      });
      // Triggers `onCreditNoteCreated` event.
      await this.eventPublisher.emitAsync(events.creditNote.onCreated, {
        tenantId,
        creditNoteDTO,
        creditNote,
        creditNoteId: creditNote.id,
        trx,
      } as ICreditNoteCreatedPayload);

      return creditNote;
    });
  };
}
