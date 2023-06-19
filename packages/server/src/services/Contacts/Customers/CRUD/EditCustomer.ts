import { Knex } from 'knex';
import {
  ICustomer,
  ICustomerEditDTO,
  ICustomerEventEditedPayload,
  ICustomerEventEditingPayload,
  ISystemUser,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CreateEditCustomerDTO } from './CreateEditCustomerDTO';

@Service()
export class EditCustomer {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private customerDTO: CreateEditCustomerDTO;

  /**
   * Edits details of the given customer.
   * @param {number} tenantId
   * @param {number} customerId
   * @param {ICustomerEditDTO} customerDTO
   * @return {Promise<ICustomer>}
   */
  public async editCustomer(
    tenantId: number,
    customerId: number,
    customerDTO: ICustomerEditDTO
  ): Promise<ICustomer> {
    const { Contact } = this.tenancy.models(tenantId);

    // Retrieve the vendor or throw not found error.
    const oldCustomer = await Contact.query()
      .findById(customerId)
      .modify('customer')
      .throwIfNotFound();

    // Transformes the given customer DTO to object.
    const customerObj = this.customerDTO.transformEditDTO(customerDTO);

    // Edits the given customer under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCustomerEditing` event.
      await this.eventPublisher.emitAsync(events.customers.onEditing, {
        tenantId,
        customerDTO,
        customerId,
        trx,
      } as ICustomerEventEditingPayload);

      // Edits the customer details on the storage.
      const customer = await Contact.query().updateAndFetchById(customerId, {
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
