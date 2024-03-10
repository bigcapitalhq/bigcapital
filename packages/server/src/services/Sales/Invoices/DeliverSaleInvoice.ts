import { Knex } from 'knex';
import moment from 'moment';
import { ServiceError } from '@/exceptions';
import {
  ISaleInvoiceDeliveringPayload,
  ISaleInvoiceEventDeliveredPayload,
} from '@/interfaces';
import { ERRORS } from './constants';
import { Inject, Service } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators';

@Service()
export class DeliverSaleInvoice {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validators: CommandSaleInvoiceValidators;

  /**
   * Deliver the given sale invoice.
   * @param  {number} tenantId - Tenant id.
   * @param  {number} saleInvoiceId - Sale invoice id.
   * @return {Promise<void>}
   */
  public async deliverSaleInvoice(
    tenantId: number,
    saleInvoiceId: number
  ): Promise<void> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale invoice id.
    const oldSaleInvoice = await SaleInvoice.query().findById(saleInvoiceId);

    // Validates the given invoice existance.
    this.validators.validateInvoiceExistance(oldSaleInvoice);

    // Throws error in case the sale invoice already published.
    if (oldSaleInvoice.isDelivered) {
      throw new ServiceError(ERRORS.SALE_INVOICE_ALREADY_DELIVERED);
    }
    // Update sale invoice transaction with assocaite transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceDelivering` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onDelivering, {
        tenantId,
        oldSaleInvoice,
        trx,
      } as ISaleInvoiceDeliveringPayload);

      // Record the delivered at on the storage.
      const saleInvoice = await SaleInvoice.query(trx)
        .patchAndFetchById(saleInvoiceId, {
          deliveredAt: moment().toMySqlDateTime(),
        })
        .withGraphFetched('entries');

      // Triggers `onSaleInvoiceDelivered` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onDelivered, {
        tenantId,
        saleInvoiceId,
        saleInvoice,
        trx,
      } as ISaleInvoiceEventDeliveredPayload);
    });
  }
}
