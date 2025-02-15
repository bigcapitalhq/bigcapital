import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import {
  IBillPaymentDeletingPayload,
  IBillPaymentEventDeletedPayload,
} from '../types/BillPayments.types';
import { BillPayment } from '../models/BillPayment';
import { BillPaymentEntry } from '../models/BillPaymentEntry';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteBillPayment {
  /**
   * @param {EventPublisher} eventPublisher - Event publisher.
   * @param {UnitOfWork} uow - Unit of work.
   * @param {typeof BillPayment} billPaymentModel - Bill payment model.
   * @param {typeof BillPaymentEntry} billPaymentEntryModel - Bill payment entry model.
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(BillPayment.name)
    private readonly billPaymentModel: TenantModelProxy<typeof BillPayment>,

    @Inject(BillPaymentEntry.name)
    private readonly billPaymentEntryModel: TenantModelProxy<
      typeof BillPaymentEntry
    >,
  ) {}

  /**
   * Deletes the bill payment and associated transactions.
   * @param {Integer} billPaymentId - The given bill payment id.
   * @return {Promise}
   */
  public async deleteBillPayment(billPaymentId: number) {
    // Retrieve the bill payment or throw not found service error.
    const oldBillPayment = await this.billPaymentModel()
      .query()
      .withGraphFetched('entries')
      .findById(billPaymentId)
      .throwIfNotFound();

    // Deletes the bill transactions with associated transactions under
    // unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBillPaymentDeleting` payload.
      await this.eventEmitter.emitAsync(events.billPayment.onDeleting, {
        oldBillPayment,
        trx,
      } as IBillPaymentDeletingPayload);

      // Deletes the bill payment associated entries.
      await this.billPaymentEntryModel()
        .query(trx)
        .where('bill_payment_id', billPaymentId)
        .delete();

      // Deletes the bill payment transaction.
      await this.billPaymentModel()
        .query(trx)
        .where('id', billPaymentId)
        .delete();

      // Triggers `onBillPaymentDeleted` event.
      await this.eventEmitter.emitAsync(events.billPayment.onDeleted, {
        billPaymentId,
        oldBillPayment,
        trx,
      } as IBillPaymentEventDeletedPayload);
    });
  }
}
