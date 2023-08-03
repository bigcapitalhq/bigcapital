import { Service, Inject } from 'typedi';
import moment from 'moment';
import { Knex } from 'knex';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import {
  ISaleReceiptEventClosedPayload,
  ISaleReceiptEventClosingPayload,
} from '@/interfaces';

@Service()
export class CloseSaleReceipt {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Mark the given sale receipt as closed.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @return {Promise<void>}
   */
  public async closeSaleReceipt(
    tenantId: number,
    saleReceiptId: number
  ): Promise<void> {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    // Retrieve sale receipt or throw not found service error.
    const oldSaleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries')
      .throwIfNotFound();

    // Throw service error if the sale receipt already closed.
    if (oldSaleReceipt.isClosed) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_IS_ALREADY_CLOSED);
    }
    // Updates the sale recept transaction under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleReceiptClosing` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onClosing, {
        tenantId,
        oldSaleReceipt,
        trx,
      } as ISaleReceiptEventClosingPayload);

      // Mark the sale receipt as closed on the storage.
      const saleReceipt = await SaleReceipt.query(trx)
        .findById(saleReceiptId)
        .patch({
          closedAt: moment().toMySqlDateTime(),
        });

      // Triggers `onSaleReceiptClosed` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onClosed, {
        saleReceiptId,
        saleReceipt,
        tenantId,
        trx,
      } as ISaleReceiptEventClosedPayload);
    });
  }
}
