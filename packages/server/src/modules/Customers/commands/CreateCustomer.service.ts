import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateEditCustomerDTO } from './CreateEditCustomerDTO.service';
import { CustomerIncrement } from './CustomerIncrement.service';
import { CustomerValidators } from './CustomerValidators.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Customer } from '../models/Customer';
import { events } from '@/common/events/events';
import {
  ICustomerEventCreatedPayload,
  ICustomerEventCreatingPayload,
} from '../types/Customers.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateCustomerDto } from '../dtos/CreateCustomer.dto';

@Injectable()
export class CreateCustomer {
  /**
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {CreateEditCustomerDTO} customerDTO - Customer DTO.
   * @param {CustomerIncrement} customerIncrement - Customer increment service.
   * @param {CustomerValidators} validators - Customer validators service.
   * @param {typeof Customer} customerModel - Customer model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly customerDTO: CreateEditCustomerDTO,
    private readonly customerIncrement: CustomerIncrement,
    private readonly validators: CustomerValidators,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Creates a new customer.
   * @param {CreateCustomerDto} customerDTO
   * @return {Promise<ICustomer>}
   */
  public async createCustomer(
    customerDTO: CreateCustomerDto,
    trx?: Knex.Transaction,
  ): Promise<Customer> {
    // Transformes the customer DTO to customer object.
    const customerObj = await this.customerDTO.transformCreateDTO(customerDTO);

    // Retrieves the next auto-generated customer code when no manual code provided.
    const autoCode = customerObj.code
      ? ''
      : await this.customerIncrement.getNextCustomerCode();

    // Manual codes take precedence over auto-generated ones.
    const code = customerObj.code || autoCode;
    const isAutoCodeUsed = !customerObj.code && Boolean(autoCode);

    // Validates the customer code uniqueness.
    await this.validators.validateCustomerCodeUnique(code);

    // Creates a new customer under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onCustomerCreating` event.
      await this.eventPublisher.emitAsync(events.customers.onCreating, {
        customerDTO,
        trx,
      } as ICustomerEventCreatingPayload);

      // Creates a new contact as customer.
      const customer = await this.customerModel()
        .query(trx)
        .insertAndFetch({
          ...customerObj,
          ...(code ? { code } : {}),
        });

      // Increments the next customer code once the auto-generated code is used.
      if (isAutoCodeUsed) {
        await this.customerIncrement.incrementNextCustomerCode();
      }
      // Triggers `onCustomerCreated` event.
      await this.eventPublisher.emitAsync(events.customers.onCreated, {
        customer,
        customerId: customer.id,
        trx,
      } as ICustomerEventCreatedPayload);

      return customer;
    }, trx);
  }
}
