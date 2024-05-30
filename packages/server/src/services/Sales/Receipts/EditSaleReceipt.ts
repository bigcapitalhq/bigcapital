import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import {
  ISaleReceiptEditedPayload,
  ISaleReceiptEditingPayload,
} from '@/interfaces';
import { SaleReceiptValidators } from './SaleReceiptValidators';
import { SaleReceiptDTOTransformer } from './SaleReceiptDTOTransformer';

@Service()
export class EditSaleReceipt {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validators: SaleReceiptValidators;

  @Inject()
  private DTOTransformer: SaleReceiptDTOTransformer;

  /**
   * Edit details sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @param {ISaleReceipt} saleReceipt
   * @return {void}
   */
  public async editSaleReceipt(
    tenantId: number,
    saleReceiptId: number,
    saleReceiptDTO: any
  ) {
    const { SaleReceipt, Contact } = this.tenancy.models(tenantId);

    // Retrieve sale receipt or throw not found service error.
    const oldSaleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries');

    // Validates the sale receipt existance.
    this.validators.validateReceiptExistance(oldSaleReceipt);

    // Retrieves the payment customer model.
    const paymentCustomer = await Contact.query()
      .findById(saleReceiptDTO.customerId)
      .modify('customer')
      .throwIfNotFound();

    // Transform sale receipt DTO to model.
    const saleReceiptObj = await this.DTOTransformer.transformDTOToModel(
      tenantId,
      saleReceiptDTO,
      paymentCustomer,
      oldSaleReceipt
    );
    // Validate receipt deposit account existance and type.
    await this.validators.validateReceiptDepositAccountExistance(
      tenantId,
      saleReceiptDTO.depositAccountId
    );
    // Validate items IDs existance on the storage.
    await this.itemsEntriesService.validateItemsIdsExistance(
      tenantId,
      saleReceiptDTO.entries
    );
    // Validate the sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      saleReceiptDTO.entries
    );
    // Validate sale receipt number uniuqiness.
    if (saleReceiptDTO.receiptNumber) {
      await this.validators.validateReceiptNumberUnique(
        tenantId,
        saleReceiptDTO.receiptNumber,
        saleReceiptId
      );
    }
    // Edits the sale receipt tranasctions with associated transactions under UOW env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleReceiptsEditing` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onEditing, {
        tenantId,
        oldSaleReceipt,
        saleReceiptDTO,
        trx,
      } as ISaleReceiptEditingPayload);

      // Upsert the receipt graph to the storage.
      const saleReceipt = await SaleReceipt.query(trx).upsertGraphAndFetch({
        id: saleReceiptId,
        ...saleReceiptObj,
      });
      // Triggers `onSaleReceiptEdited` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onEdited, {
        tenantId,
        oldSaleReceipt,
        saleReceipt,
        saleReceiptId,
        saleReceiptDTO,
        trx,
      } as ISaleReceiptEditedPayload);

      return saleReceipt;
    });
  }
}
