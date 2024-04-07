import { ServiceError } from '@/exceptions';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import TenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import { ERRORS } from './constants';

@Service()
export class RejectSaleEstimate {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Mark the sale estimate as rejected from the customer.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   */
  public async rejectSaleEstimate(tenantId: number, saleEstimateId: number): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale estimate id.
    const saleEstimate = await SaleEstimate.query().findById(saleEstimateId).throwIfNotFound();

    // Throws error in case the sale estimate still not delivered to customer.
    if (!saleEstimate.isDelivered) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_DELIVERED);
    }
    // Throws error in case the sale estimate already rejected.
    if (saleEstimate.isRejected) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_ALREADY_REJECTED);
    }
    //
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Mark the sale estimate as reject on the storage.
      await SaleEstimate.query(trx).where('id', saleEstimateId).patch({
        rejectedAt: moment().toMySqlDateTime(),
        approvedAt: null,
      });
      // Triggers `onSaleEstimateRejected` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onRejected, {});
    });
  }
}
