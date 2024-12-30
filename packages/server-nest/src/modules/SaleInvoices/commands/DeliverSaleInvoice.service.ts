import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import * as moment from 'moment';
import {
  ISaleInvoiceDeliveringPayload,
  ISaleInvoiceEventDeliveredPayload,
} from '../SaleInvoice.types';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ERRORS } from '../constants';
import { SaleInvoice } from '../models/SaleInvoice';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class DeliverSaleInvoice {
  constructor(
    private eventEmitter: EventEmitter2,
    private uow: UnitOfWork,
    private validators: CommandSaleInvoiceValidators,

    @Inject(SaleInvoice.name) private saleInvoiceModel: typeof SaleInvoice,
  ) {}

  /**
   * Deliver the given sale invoice.
   * @param  {number} saleInvoiceId - Sale invoice id.
   * @return {Promise<void>}
   */
  public async deliverSaleInvoice(saleInvoiceId: number): Promise<void> {
    // Retrieve details of the given sale invoice id.
    const oldSaleInvoice = await this.saleInvoiceModel
      .query()
      .findById(saleInvoiceId);

    // Validates the given invoice existence.
    this.validators.validateInvoiceExistance(oldSaleInvoice);

    // Throws error in case the sale invoice already published.
    if (oldSaleInvoice.isDelivered) {
      throw new ServiceError(ERRORS.SALE_INVOICE_ALREADY_DELIVERED);
    }
    // Update sale invoice transaction with associate transactions
    // under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceDelivering` event.
      await this.eventEmitter.emitAsync(events.saleInvoice.onDelivering, {
        oldSaleInvoice,
        trx,
      } as ISaleInvoiceDeliveringPayload);

      // Record the delivered at on the storage.
      const saleInvoice = await this.saleInvoiceModel
        .query(trx)
        .patchAndFetchById(saleInvoiceId, {
          deliveredAt: moment().toMySqlDateTime(),
        })
        .withGraphFetched('entries');

      // Triggers `onSaleInvoiceDelivered` event.
      await this.eventEmitter.emitAsync(events.saleInvoice.onDelivered, {
        saleInvoiceId,
        saleInvoice,
        trx,
      } as ISaleInvoiceEventDeliveredPayload);
    });
  }
}
