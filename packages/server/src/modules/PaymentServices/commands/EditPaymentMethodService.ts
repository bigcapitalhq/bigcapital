import { Knex } from 'knex';
import { EditPaymentMethodDTO } from '../types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { PaymentIntegration } from '../models/PaymentIntegration.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';

@Injectable()
export class EditPaymentMethodService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,

    @Inject(PaymentIntegration.name)
    private readonly paymentIntegrationModel: TenantModelProxy<
      typeof PaymentIntegration
    >,
  ) {}

  /**
   * Edits the given payment method.
   * @param {number} paymentIntegrationId - The ID of the payment method.
   * @param {EditPaymentMethodDTO} editPaymentMethodDTO
   * @returns {Promise<void>}
   */
  async editPaymentMethod(
    paymentIntegrationId: number,
    editPaymentMethodDTO: EditPaymentMethodDTO,
  ): Promise<void> {
    const paymentMethod = await this.paymentIntegrationModel()
      .query()
      .findById(paymentIntegrationId)
      .throwIfNotFound();

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onPaymentMethodEditing` event.
      await this.eventEmitter.emitAsync(events.paymentMethod.onEditing, {
        paymentIntegrationId,
        editPaymentMethodDTO,
        trx,
      });
      await this.paymentIntegrationModel()
        .query(trx)
        .findById(paymentIntegrationId)
        .patch({
          ...editPaymentMethodDTO,
        });
      // Triggers `onPaymentMethodEdited` event.
      await this.eventEmitter.emitAsync(events.paymentMethod.onEdited, {
        paymentIntegrationId,
        editPaymentMethodDTO,
        trx,
      });
    });
  }
}
