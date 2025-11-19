import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { PaymentReceived } from '../models/PaymentReceived';
import { PaymentReceivedEntry } from '../models/PaymentReceivedEntry';
import {
  IPaymentReceivedDeletingPayload,
  IPaymentReceivedDeletedPayload,
} from '../types/PaymentReceived.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeletePaymentReceivedService {
  /**
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {UnitOfWork} uow - Unit of work.
   * @param {typeof PaymentReceived} paymentReceiveModel - Payment received model.
   * @param {typeof PaymentReceivedEntry} paymentReceiveEntryModel - Payment received entry model.
   */
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,

    @Inject(PaymentReceived.name)
    private paymentReceiveModel: TenantModelProxy<typeof PaymentReceived>,

    @Inject(PaymentReceivedEntry.name)
    private paymentReceiveEntryModel: TenantModelProxy<
      typeof PaymentReceivedEntry
    >,
  ) { }

  /**
   * Deletes the given payment receive with associated entries
   * and journal transactions.
   * -----
   * - Deletes the payment receive transaction.
   * - Deletes the payment receive associated entries.
   * - Deletes the payment receive associated journal transactions.
   * - Revert the customer balance.
   * - Revert the payment amount of the associated invoices.
   * @async
   * @param {Integer} paymentReceiveId - Payment receive id.
   * @param {Knex.Transaction} trx - Database transaction instance.
   */
  public async deletePaymentReceive(
    paymentReceiveId: number,
    trx?: Knex.Transaction,
  ) {
    // Retreive payment receive or throw not found service error.
    const oldPaymentReceive = await this.paymentReceiveModel()
      .query()
      .withGraphFetched('entries')
      .findById(paymentReceiveId)
      .throwIfNotFound();

    // Delete payment receive transaction and associate transactions under UOW env.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onPaymentReceiveDeleting` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onDeleting, {
        oldPaymentReceive,
        trx,
      } as IPaymentReceivedDeletingPayload);

      // Deletes the payment receive associated entries.
      await this.paymentReceiveEntryModel()
        .query(trx)
        .where('payment_receive_id', paymentReceiveId)
        .delete();

      // Deletes the payment receive transaction.
      await this.paymentReceiveModel()
        .query(trx)
        .findById(paymentReceiveId)
        .delete();

      // Triggers `onPaymentReceiveDeleted` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onDeleted, {
        paymentReceiveId,
        oldPaymentReceive,
        trx,
      } as IPaymentReceivedDeletedPayload);
    }, trx);
  }
}
