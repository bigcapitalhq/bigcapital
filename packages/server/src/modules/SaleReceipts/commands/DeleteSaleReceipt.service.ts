import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ISaleReceiptDeletingPayload,
  ISaleReceiptEventDeletedPayload,
} from '../types/SaleReceipts.types';
import { SaleReceiptValidators } from './SaleReceiptValidators.service';
import { SaleReceipt } from '../models/SaleReceipt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteSaleReceipt {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: SaleReceiptValidators,

    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: TenantModelProxy<typeof SaleReceipt>,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,
  ) {}

  /**
   * Deletes the sale receipt with associated entries.
   * @param {Integer} saleReceiptId - Sale receipt identifier.
   * @param {Knex.Transaction} trx - Database transaction instance.
   * @return {void}
   */
  public async deleteSaleReceipt(
    saleReceiptId: number,
    trx?: Knex.Transaction,
  ) {
    const oldSaleReceipt = await this.saleReceiptModel()
      .query()
      .findById(saleReceiptId)
      .withGraphFetched('entries');

    // Validates the sale receipt existence.
    this.validators.validateReceiptExistence(oldSaleReceipt);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleReceiptsDeleting` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onDeleting, {
        trx,
        oldSaleReceipt,
      } as ISaleReceiptDeletingPayload);

      await this.itemEntryModel()
        .query(trx)
        .where('reference_id', saleReceiptId)
        .where('reference_type', 'SaleReceipt')
        .delete();

      // Delete the sale receipt transaction.
      await this.saleReceiptModel()
        .query(trx)
        .where('id', saleReceiptId)
        .delete();

      // Triggers `onSaleReceiptsDeleted` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onDeleted, {
        saleReceiptId,
        oldSaleReceipt,
        trx,
      } as ISaleReceiptEventDeletedPayload);
    }, trx);
  }
}
