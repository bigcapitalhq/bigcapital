import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class DeletePaymentMethodService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Deletes the given payment integration.
   * @param {number} tenantId
   * @param {number} paymentIntegrationId
   * @returns {Promise<void>}
   */
  public async deletePaymentMethod(
    tenantId: number,
    paymentIntegrationId: number
  ): Promise<void> {
    const { PaymentIntegration, TransactionPaymentServiceEntry } =
      this.tenancy.models(tenantId);

    const paymentIntegration = await PaymentIntegration.query()
      .findById(paymentIntegrationId)
      .throwIfNotFound();

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Delete payment methods links.
      await TransactionPaymentServiceEntry.query(trx)
        .where('paymentIntegrationId', paymentIntegrationId)
        .delete();

      // Delete the payment integration.
      await PaymentIntegration.query(trx)
        .findById(paymentIntegrationId)
        .delete();

      // Triggers `onPaymentMethodDeleted` event.
      await this.eventPublisher.emitAsync(events.paymentMethod.onDeleted, {
        tenantId,
        paymentIntegrationId,
      });
    });
  }
}
