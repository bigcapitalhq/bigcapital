import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import {
  IPaymentReceivedDeletedPayload,
  IPaymentReceivedDeletingPayload,
  ISystemUser,
} from '@/interfaces';
import UnitOfWork from '@/services/UnitOfWork';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export class DeletePaymentReceived {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

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
   * @param {number} tenantId - Tenant id.
   * @param {Integer} paymentReceiveId - Payment receive id.
   * @param {IPaymentReceived} paymentReceive - Payment receive object.
   */
  public async deletePaymentReceive(
    tenantId: number,
    paymentReceiveId: number,
    authorizedUser: ISystemUser
  ) {
    const { PaymentReceive, PaymentReceiveEntry } =
      this.tenancy.models(tenantId);

    // Retreive payment receive or throw not found service error.
    const oldPaymentReceive = await PaymentReceive.query()
      .withGraphFetched('entries')
      .findById(paymentReceiveId)
      .throwIfNotFound();

    // Delete payment receive transaction and associate transactions under UOW env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onPaymentReceiveDeleting` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onDeleting, {
        tenantId,
        oldPaymentReceive,
        trx,
      } as IPaymentReceivedDeletingPayload);

      // Deletes the payment receive associated entries.
      await PaymentReceiveEntry.query(trx)
        .where('payment_receive_id', paymentReceiveId)
        .delete();

      // Deletes the payment receive transaction.
      await PaymentReceive.query(trx).findById(paymentReceiveId).delete();

      // Triggers `onPaymentReceiveDeleted` event.
      await this.eventPublisher.emitAsync(events.paymentReceive.onDeleted, {
        tenantId,
        paymentReceiveId,
        oldPaymentReceive,
        authorizedUser,
        trx,
      } as IPaymentReceivedDeletedPayload);
    });
  }
}
