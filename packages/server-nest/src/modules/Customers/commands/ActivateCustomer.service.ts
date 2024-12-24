import { Inject, Injectable } from '@nestjs/common';
import { CustomerValidators } from './CustomerValidators.service';
import {
  ICustomerActivatedPayload,
  ICustomerActivatingPayload,
} from '../types/Customers.types';
import { Customer } from '@/modules/Customers/models/Customer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { Knex } from 'knex';

@Injectable()
export class ActivateCustomer {
  /**
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {CustomerValidators} validators - Customer validators service.
   * @param {typeof Customer} customerModel - Customer model.
   */
  constructor(
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
    private validators: CustomerValidators,

    @Inject(Customer.name)
    private customerModel: typeof Customer,
  ) {}

  /**
   * Inactive the given contact.
   * @param {number} customerId - Customer id.
   * @returns {Promise<void>}
   */
  public async activateCustomer(customerId: number): Promise<void> {
    // Retrieves the customer or throw not found error.
    const oldCustomer = await this.customerModel
      .query()
      .findById(customerId)
      .throwIfNotFound();

    this.validators.validateNotAlreadyPublished(oldCustomer);

    // Edits the given customer with associated transactions on unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onCustomerActivating` event.
      await this.eventPublisher.emitAsync(events.customers.onActivating, {
        trx,
        oldCustomer,
      } as ICustomerActivatingPayload);

      // Update the given customer details.
      const customer = await this.customerModel
        .query(trx)
        .findById(customerId)
        .updateAndFetchById(customerId, { active: true });

      // Triggers `onCustomerActivated` event.
      await this.eventPublisher.emitAsync(events.customers.onActivated, {
        trx,
        oldCustomer,
        customer,
      } as ICustomerActivatedPayload);
    });
  }
}
