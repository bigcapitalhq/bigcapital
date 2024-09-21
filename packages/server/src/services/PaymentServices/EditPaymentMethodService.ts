import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { EditPaymentMethodDTO } from './types';
import events from '@/subscribers/events';

@Service()
export class EditPaymentMethodService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Edits the given payment method.
   * @param {number} tenantId
   * @param {number} paymentIntegrationId
   * @param {EditPaymentMethodDTO} editPaymentMethodDTO
   * @returns {Promise<void>}
   */
  async editPaymentMethod(
    tenantId: number,
    paymentIntegrationId: number,
    editPaymentMethodDTO: EditPaymentMethodDTO
  ): Promise<void> {
    const { PaymentIntegration } = this.tenancy.models(tenantId);

    const paymentMethod = await PaymentIntegration.query()
      .findById(paymentIntegrationId)
      .throwIfNotFound();

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onPaymentMethodEditing` event.
      await this.eventPublisher.emitAsync(events.paymentMethod.onEditing, {
        tenantId,
        paymentIntegrationId,
        editPaymentMethodDTO,
        trx,
      });
      await PaymentIntegration.query(trx)
        .findById(paymentIntegrationId)
        .patch({
          ...editPaymentMethodDTO,
        });
      // Triggers `onPaymentMethodEdited` event.
      await this.eventPublisher.emitAsync(events.paymentMethod.onEdited, {
        tenantId,
        paymentIntegrationId,
        editPaymentMethodDTO,
        trx,
      });
    });
  }
}
