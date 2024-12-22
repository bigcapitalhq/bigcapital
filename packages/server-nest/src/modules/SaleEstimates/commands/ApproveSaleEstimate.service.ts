import { Inject, Injectable } from '@nestjs/common';
import {
  ISaleEstimateApprovedEvent,
  ISaleEstimateApprovingEvent,
} from '../types/SaleEstimates.types';
import { ERRORS } from '../constants';
import { Knex } from 'knex';
import moment from 'moment';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { SaleEstimate } from '../models/SaleEstimate';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class ApproveSaleEstimateService {
  constructor(
    @Inject(SaleEstimate.name)
    private saleEstimateModel: typeof SaleEstimate,
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
  ) {}

  /**
   * Mark the sale estimate as approved from the customer.
   * @param {number} saleEstimateId
   * @return {Promise<void>}
   */
  public async approveSaleEstimate(saleEstimateId: number): Promise<void> {
    // Retrieve details of the given sale estimate id.
    const oldSaleEstimate = await this.saleEstimateModel
      .query()
      .findById(saleEstimateId)
      .throwIfNotFound();

    // Throws error in case the sale estimate still not delivered to customer.
    if (!oldSaleEstimate.isDelivered) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_DELIVERED);
    }
    // Throws error in case the sale estimate already approved.
    if (oldSaleEstimate.isApproved) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_ALREADY_APPROVED);
    }
    // Triggers `onSaleEstimateApproving` event.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleEstimateApproving` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onApproving, {
        trx,
        oldSaleEstimate,
      } as ISaleEstimateApprovingEvent);

      // Update estimate as approved.
      const saleEstimate = await this.saleEstimateModel
        .query(trx)
        .where('id', saleEstimateId)
        .patchAndFetch({
          approvedAt: moment().toMySqlDateTime(),
          rejectedAt: null,
        });
      // Triggers `onSaleEstimateApproved` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onApproved, {
        trx,
        oldSaleEstimate,
        saleEstimate,
      } as ISaleEstimateApprovedEvent);
    });
  }
}
