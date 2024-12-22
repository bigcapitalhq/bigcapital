import { Inject, Injectable } from '@nestjs/common';
import {
  ISaleEstimateDeletedPayload,
  ISaleEstimateDeletingPayload,
} from '../types/SaleEstimates.types';
import { ERRORS } from '../constants';
import { Knex } from 'knex';
import { SaleEstimate } from '../models/SaleEstimate';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';

@Injectable()
export class DeleteSaleEstimate {
  constructor(
    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: typeof SaleEstimate,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: typeof ItemEntry,

    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
  ) {}

  /**
   * Deletes the given estimate id with associated entries.
   * @async
   * @param {number} estimateId
   * @return {Promise<void>}
   */
  public async deleteEstimate(estimateId: number): Promise<void> {
    // Retrieve sale estimate or throw not found service error.
    const oldSaleEstimate = await this.saleEstimateModel
      .query()
      .findById(estimateId)
      .throwIfNotFound();

    // Throw error if the sale estimate converted to sale invoice.
    if (oldSaleEstimate.convertedToInvoiceId) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_CONVERTED_TO_INVOICE);
    }
    // Updates the estimate with associated transactions under UOW enivrement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleEstimatedDeleting` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDeleting, {
        trx,
        oldSaleEstimate,
      } as ISaleEstimateDeletingPayload);

      // Delete sale estimate entries.
      await this.itemEntryModel
        .query(trx)
        .where('reference_id', estimateId)
        .where('reference_type', 'SaleEstimate')
        .delete();

      // Delete sale estimate transaction.
      await this.saleEstimateModel.query(trx).where('id', estimateId).delete();

      // Triggers `onSaleEstimatedDeleted` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDeleted, {
        saleEstimateId: estimateId,
        oldSaleEstimate,
        trx,
      } as ISaleEstimateDeletedPayload);
    });
  }
}
