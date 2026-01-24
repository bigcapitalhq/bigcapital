import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ICustomerOpeningBalanceEditedPayload,
  ICustomerOpeningBalanceEditingPayload,
} from '../types/Customers.types';
import { CustomerOpeningBalanceEditDto } from '../dtos/CustomerOpeningBalanceEdit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Customer } from '../models/Customer';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class EditOpeningBalanceCustomer {
  /**
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {typeof Customer} customerModel - Customer model.
   */
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,

    @Inject(Customer.name)
    private customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Changes the opening balance of the given customer.
   * @param {number} customerId - Customer ID.
   * @param {CustomerOpeningBalanceEditDto} openingBalanceEditDTO
   */
  public async changeOpeningBalance(
    customerId: number,
    openingBalanceEditDTO: CustomerOpeningBalanceEditDto,
  ): Promise<Customer> {
    // Retrieves the old customer or throw not found error.
    const oldCustomer = await this.customerModel()
      .query()
      .findById(customerId)
      .throwIfNotFound();

    // Mutates the customer opening balance under unit-of-work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onCustomerOpeningBalanceChanging` event.
      await this.eventPublisher.emitAsync(
        events.customers.onOpeningBalanceChanging,
        {
          oldCustomer,
          openingBalanceEditDTO,
          trx,
        } as ICustomerOpeningBalanceEditingPayload,
      );
      // Mutates the customer on the storage.
      const customer = await this.customerModel()
        .query()
        .patchAndFetchById(customerId, {
          ...openingBalanceEditDTO,
        });
      // Triggers `onCustomerOpeingBalanceChanged` event.
      await this.eventPublisher.emitAsync(
        events.customers.onOpeningBalanceChanged,
        {
          customer,
          oldCustomer,
          openingBalanceEditDTO,
          trx,
        } as ICustomerOpeningBalanceEditedPayload,
      );
      return customer;
    });
  }
}
