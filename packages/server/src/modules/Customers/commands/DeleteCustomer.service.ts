import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ICustomerDeletingPayload,
  ICustomerEventDeletedPayload,
} from '../types/Customers.types';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Customer } from '../models/Customer';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ERRORS } from '../constants';

@Injectable()
export class DeleteCustomer {
  /**
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {typeof Customer} contactModel - Customer model.
   */
  constructor(
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,

    @Inject(Customer.name)
    private customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Deletes the given customer from the storage.
   * @param {number} customerId - Customer ID.
   * @return {Promise<void>}
   */
  public async deleteCustomer(
    customerId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Retrieve the customer or throw not found service error.
    const query = this.customerModel().query(trx);
    const oldCustomer = await query.findById(customerId).throwIfNotFound();

    // Triggers `onCustomerDeleting` event.
    await this.eventPublisher.emitAsync(events.customers.onDeleting, {
      customerId,
      oldCustomer,
    } as ICustomerDeletingPayload);

    // Deletes the customer and associated entities under UOW transaction.
    return this.uow.withTransaction(async (transaction: Knex.Transaction) => {
      // Delete the customer from the storage.
      await this.customerModel()
        .query(transaction)
        .findById(customerId)
        .deleteIfNoRelations({
          type: ERRORS.CUSTOMER_HAS_TRANSACTIONS,
          message: 'Customer has associated transactions',
        });
      // Throws `onCustomerDeleted` event.
      await this.eventPublisher.emitAsync(events.customers.onDeleted, {
        customerId,
        oldCustomer,
        trx: transaction,
      } as ICustomerEventDeletedPayload);
    }, trx);
  }
}
