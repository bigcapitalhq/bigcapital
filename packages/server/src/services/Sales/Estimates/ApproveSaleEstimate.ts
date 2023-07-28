import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { ERRORS } from '../constants';
import { ISaleEstimateApprovingEvent } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';

@Service()
export class ApproveSaleEstimate {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Mark the sale estimate as approved from the customer.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   */
  public async approveSaleEstimate(
    tenantId: number,
    saleEstimateId: number
  ): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale estimate id.
    const oldSaleEstimate = await this.getSaleEstimateOrThrowError(
      tenantId,
      saleEstimateId
    );
    // Throws error in case the sale estimate still not delivered to customer.
    if (!oldSaleEstimate.isDelivered) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_DELIVERED);
    }
    // Throws error in case the sale estimate already approved.
    if (oldSaleEstimate.isApproved) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_ALREADY_APPROVED);
    }
    // Triggers `onSaleEstimateApproving` event.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleEstimateApproving` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onApproving, {
        trx,
        tenantId,
        oldSaleEstimate,
      } as ISaleEstimateApprovingEvent);

      // Update estimate as approved.
      const saleEstimate = await SaleEstimate.query(trx)
        .where('id', saleEstimateId)
        .patch({
          approvedAt: moment().toMySqlDateTime(),
          rejectedAt: null,
        });
      // Triggers `onSaleEstimateApproved` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onApproved, {
        trx,
        tenantId,
        oldSaleEstimate,
        saleEstimate,
      } as ISaleEstimateApprovedEvent);
    });
  }
}
