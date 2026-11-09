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
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeliverSaleInvoice {
  /**
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {UnitOfWork} uow - Unit of work.
   * @param {CommandSaleInvoiceValidators} validators - Command sale invoice validators.
   * @param {TenantModelProxy<typeof SaleInvoice>} saleInvoiceModel - Sale invoice model.
   */
  constructor(
    private eventEmitter: EventEmitter2,
    private uow: UnitOfWork,
    private validators: CommandSaleInvoiceValidators,

    @Inject(SaleInvoice.name)
    private saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Deliver the given sale invoice.
   * @param  {number} saleInvoiceId - Sale invoice id.
   * @return {Promise<void>}
   */
  public async deliverSaleInvoice(saleInvoiceId: number): Promise<void> {
    // Update sale invoice transaction with associate transactions
    // under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the deliver operation against the locked invoice row.
      const oldSaleInvoice = await this.validate(saleInvoiceId, trx);

      // Triggers `onSaleInvoiceDelivering` event.
      await this.eventEmitter.emitAsync(events.saleInvoice.onDelivering, {
        oldSaleInvoice,
        trx,
      } as ISaleInvoiceDeliveringPayload);

      // Record the delivered at on the storage.
      const saleInvoice = await this.saleInvoiceModel()
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

  /**
   * Validates the deliver sale invoice operation against the locked invoice
   * row: existence and not already delivered.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {Knex.Transaction} trx - Locks the invoice row (FOR UPDATE).
   * @returns {Promise<SaleInvoice>} The locked sale invoice.
   */
  async validate(
    saleInvoiceId: number,
    trx: Knex.Transaction,
  ): Promise<SaleInvoice> {
    // Re-read the invoice with a row lock to validate against current state.
    const oldSaleInvoice = await this.saleInvoiceModel()
      .query(trx)
      .findById(saleInvoiceId)
      .forUpdate()
      .withGraphFetched('entries')
      .throwIfNotFound();

    // Throws error in case the sale invoice already published.
    if (oldSaleInvoice.isDelivered) {
      throw new ServiceError(ERRORS.SALE_INVOICE_ALREADY_DELIVERED);
    }
    return oldSaleInvoice;
  }
}
