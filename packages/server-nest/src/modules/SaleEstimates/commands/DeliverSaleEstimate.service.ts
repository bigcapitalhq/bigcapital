import { Knex } from 'knex';
import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ISaleEstimateEventDeliveredPayload,
  ISaleEstimateEventDeliveringPayload,
} from '../types/SaleEstimates.types';
import { ERRORS } from '../constants';
import { SaleEstimate } from '../models/SaleEstimate';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class DeliverSaleEstimateService {
  constructor(
    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: typeof SaleEstimate,
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
  ) {}

  /**
   * Mark the sale estimate as delivered.
   * @param {number} saleEstimateId - Sale estimate id.
   */
  public async deliverSaleEstimate(saleEstimateId: number): Promise<void> {
    // Retrieve details of the given sale estimate id.
    const oldSaleEstimate = await this.saleEstimateModel
      .query()
      .findById(saleEstimateId)
      .throwIfNotFound();

    // Throws error in case the sale estimate already published.
    if (oldSaleEstimate.isDelivered) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_ALREADY_DELIVERED);
    }

    // Updates the sale estimate transaction with assocaited transactions
    // under UOW envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleEstimateDelivering` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDelivering, {
        oldSaleEstimate,
        trx,
      } as ISaleEstimateEventDeliveringPayload);

      // Record the delivered at on the storage.
      const saleEstimate = await this.saleEstimateModel
        .query(trx)
        .patchAndFetchById(saleEstimateId, {
          deliveredAt: moment().toMySqlDateTime(),
        });

      // Triggers `onSaleEstimateDelivered` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDelivered, {
        saleEstimate,
        trx,
      } as ISaleEstimateEventDeliveredPayload);
    });
  }
}
