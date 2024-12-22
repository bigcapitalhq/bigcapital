import { Inject, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Knex } from 'knex';
import { SaleEstimate } from '../models/SaleEstimate';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';
import { events } from '@/common/events/events';


@Injectable()
export class RejectSaleEstimateService {
  constructor(
    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: typeof SaleEstimate,
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
  ) {}

  /**
   * Mark the sale estimate as rejected from the customer.
   * @param {number} saleEstimateId
   */
  public async rejectSaleEstimate(saleEstimateId: number): Promise<void> {
    // Retrieve details of the given sale estimate id.
    const saleEstimate = await this.saleEstimateModel.query()
      .findById(saleEstimateId)
      .throwIfNotFound();

    // Throws error in case the sale estimate still not delivered to customer.
    if (!saleEstimate.isDelivered) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_DELIVERED);
    }
    // Throws error in case the sale estimate already rejected.
    if (saleEstimate.isRejected) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_ALREADY_REJECTED);
    }

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Mark the sale estimate as reject on the storage.
      await this.saleEstimateModel.query(trx).where('id', saleEstimateId).patch({
        rejectedAt: moment().toMySqlDateTime(),
        approvedAt: null,
      });
      // Triggers `onSaleEstimateRejected` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onRejected, {});
    });
  }
}
