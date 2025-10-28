import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ICustomerEditDTO,
  ICustomerEventEditedPayload,
  ICustomerEventEditingPayload,
} from '../types/Customers.types';
import { CreateEditCustomerDTO } from './CreateEditCustomerDTO.service';
import { Customer } from '../models/Customer';
import { events } from '@/common/events/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditCustomerDto } from '../dtos/EditCustomer.dto';

@Injectable()
export class EditCustomer {
  /**
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {CreateEditCustomerDTO} customerDTO - Customer DTO.
   * @param {TenantModelProxy<typeof Customer>} contactModel - Customer model.
   */
  constructor(
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
    private customerDTO: CreateEditCustomerDTO,

    @Inject(Customer.name)
    private customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Edits details of the given customer.
   * @param {number} customerId
   * @param {ICustomerEditDTO} customerDTO
   * @return {Promise<ICustomer>}
   */
  public async editCustomer(
    customerId: number,
    customerDTO: EditCustomerDto,
  ): Promise<Customer> {
    // Retrieve the customer or throw not found error.
    const oldCustomer = await this.customerModel()
      .query()
      .findById(customerId)
      .throwIfNotFound();

    // Transforms the given customer DTO to object.
    const customerObj = this.customerDTO.transformEditDTO(customerDTO);

    // Edits the given customer under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onCustomerEditing` event.
      await this.eventPublisher.emitAsync(events.customers.onEditing, {
        customerDTO,
        customerId,
        trx,
      } as ICustomerEventEditingPayload);

      // Edits the customer details on the storage.
      const customer = await this.customerModel()
        .query()
        .updateAndFetchById(customerId, {
          ...customerObj,
        });
      // Triggers `onCustomerEdited` event.
      await this.eventPublisher.emitAsync(events.customers.onEdited, {
        customerId,
        customer,
        trx,
      } as ICustomerEventEditedPayload);

      return customer;
    });
  }
}
