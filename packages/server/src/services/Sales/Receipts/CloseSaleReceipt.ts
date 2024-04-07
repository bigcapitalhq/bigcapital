import { ISaleReceiptEventClosedPayload, ISaleReceiptEventClosingPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import TenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import { SaleReceiptValidators } from './SaleReceiptValidators';

@Service()
export class CloseSaleReceipt {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validators: SaleReceiptValidators;

  /**
   * Mark the given sale receipt as closed.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @return {Promise<void>}
   */
  public async closeSaleReceipt(tenantId: number, saleReceiptId: number): Promise<void> {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    // Retrieve sale receipt or throw not found service error.
    const oldSaleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries')
      .throwIfNotFound();

    // Throw service error if the sale receipt already closed.
    this.validators.validateReceiptNotClosed(oldSaleReceipt);

    // Updates the sale recept transaction under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleReceiptClosing` event.
      await this.eventPublisher.emitAsync(events.saleReceipt.onClosing, {
        tenantId,
        oldSaleReceipt,
        trx,
      } as ISaleReceiptEventClosingPayload);

      // Mark the sale receipt as closed on the storage.
      const saleReceipt = await SaleReceipt.query(trx).patchAndFetchById(saleReceiptId, {
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
