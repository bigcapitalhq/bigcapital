import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import {
  ISaleEstimateDeletedPayload,
  ISaleEstimateDeletingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { ERRORS } from './constants';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import { Knex } from 'knex';

@Service()
export class DeleteSaleEstimate {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Deletes the given estimate id with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {IEstimate} estimateId
   * @return {void}
   */
  public async deleteEstimate(
    tenantId: number,
    estimateId: number
  ): Promise<void> {
    const { SaleEstimate, ItemEntry } = this.tenancy.models(tenantId);

    // Retrieve sale estimate or throw not found service error.
    const oldSaleEstimate = await SaleEstimate.query()
      .findById(estimateId)
      .throwIfNotFound();

    // Throw error if the sale estimate converted to sale invoice.
    if (oldSaleEstimate.convertedToInvoiceId) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_CONVERTED_TO_INVOICE);
    }
    // Updates the estimate with associated transactions under UOW enivrement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleEstimatedDeleting` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDeleting, {
        trx,
        tenantId,
        oldSaleEstimate,
      } as ISaleEstimateDeletingPayload);

      // Delete sale estimate entries.
      await ItemEntry.query(trx)
        .where('reference_id', estimateId)
        .where('reference_type', 'SaleEstimate')
        .delete();

      // Delete sale estimate transaction.
      await SaleEstimate.query(trx).where('id', estimateId).delete();

      // Triggers `onSaleEstimatedDeleted` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDeleted, {
        tenantId,
        saleEstimateId: estimateId,
        oldSaleEstimate,
        trx,
      } as ISaleEstimateDeletedPayload);
    });
  }
}
