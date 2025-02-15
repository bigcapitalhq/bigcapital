import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ISaleReceiptEditedPayload,
  ISaleReceiptEditingPayload,
} from '../types/SaleReceipts.types';
import { SaleReceiptValidators } from './SaleReceiptValidators.service';
import { SaleReceiptDTOTransformer } from './SaleReceiptDTOTransformer.service';
import { SaleReceipt } from '../models/SaleReceipt';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Contact } from '@/modules/Contacts/models/Contact';
import { events } from '@/common/events/events';
import { Customer } from '@/modules/Customers/models/Customer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class EditSaleReceipt {
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: SaleReceiptValidators,
    private readonly dtoTransformer: SaleReceiptDTOTransformer,

    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: TenantModelProxy<typeof SaleReceipt>,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Edit details sale receipt with associated entries.
   * @param {Integer} saleReceiptId
   * @param {ISaleReceipt} saleReceipt
   * @return {void}
   */
  public async editSaleReceipt(saleReceiptId: number, saleReceiptDTO: any) {
    // Retrieve sale receipt or throw not found service error.
    const oldSaleReceipt = await this.saleReceiptModel()
      .query()
      .findById(saleReceiptId)
      .withGraphFetched('entries')
      .throwIfNotFound();

    // Retrieves the payment customer model.
    const paymentCustomer = await this.customerModel()
      .query()
      .findById(saleReceiptDTO.customerId)
      .throwIfNotFound();

    // Transform sale receipt DTO to model.
    const saleReceiptObj = await this.dtoTransformer.transformDTOToModel(
      saleReceiptDTO,
      paymentCustomer,
      oldSaleReceipt,
    );
    // Validate receipt deposit account existance and type.
    await this.validators.validateReceiptDepositAccountExistence(
      saleReceiptDTO.depositAccountId,
    );
    // Validate items IDs existance on the storage.
    await this.itemsEntriesService.validateItemsIdsExistance(
      saleReceiptDTO.entries,
    );
    // Validate the sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      saleReceiptDTO.entries,
    );
    // Validate sale receipt number uniuqiness.
    if (saleReceiptDTO.receiptNumber) {
      await this.validators.validateReceiptNumberUnique(
        saleReceiptDTO.receiptNumber,
        saleReceiptId,
      );
    }
    // Edits the sale receipt tranasctions with associated transactions under UOW env.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleReceiptsEditing` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onEditing, {
        oldSaleReceipt,
        saleReceiptDTO,
        trx,
      } as ISaleReceiptEditingPayload);

      // Upsert the receipt graph to the storage.
      const saleReceipt = await this.saleReceiptModel()
        .query(trx)
        .upsertGraphAndFetch({
          id: saleReceiptId,
          ...saleReceiptObj,
        });
      // Triggers `onSaleReceiptEdited` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onEdited, {
        oldSaleReceipt,
        saleReceipt,
        saleReceiptDTO,
        trx,
      } as ISaleReceiptEditedPayload);

      return saleReceipt;
    });
  }
}
