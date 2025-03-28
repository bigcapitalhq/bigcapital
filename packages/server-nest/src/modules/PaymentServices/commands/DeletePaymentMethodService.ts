import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { PaymentIntegration } from '../models/PaymentIntegration.model';
import { TransactionPaymentServiceEntry } from '../models/TransactionPaymentServiceEntry.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';

@Injectable()
export class DeletePaymentMethodService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,

    @Inject(PaymentIntegration.name)
    private readonly paymentIntegrationModel: TenantModelProxy<
      typeof PaymentIntegration
    >,

    @Inject(TransactionPaymentServiceEntry.name)
    private readonly transactionPaymentServiceEntryModel: TenantModelProxy<
      typeof TransactionPaymentServiceEntry
    >,
  ) {}

  /**
   * Deletes the given payment integration.
   * @param {number} paymentIntegrationId
   * @returns {Promise<void>}
   */
  public async deletePaymentMethod(
    paymentIntegrationId: number,
  ): Promise<void> {
    const paymentIntegration = await this.paymentIntegrationModel()
      .query()
      .findById(paymentIntegrationId)
      .throwIfNotFound();

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Delete payment methods links.
      await this.transactionPaymentServiceEntryModel()
        .query(trx)
        .where('paymentIntegrationId', paymentIntegrationId)
        .delete();

      // Delete the payment integration.
      await this.paymentIntegrationModel()
        .query(trx)
        .findById(paymentIntegrationId)
        .delete();

      // Triggers `onPaymentMethodDeleted` event.
      await this.eventEmitter.emitAsync(events.paymentMethod.onDeleted, {
        paymentIntegrationId,
      });
    });
  }
}
