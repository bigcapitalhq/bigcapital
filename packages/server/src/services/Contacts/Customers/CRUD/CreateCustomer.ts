import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import {
  ICustomer,
  ICustomerEventCreatedPayload,
  ICustomerEventCreatingPayload,
  ICustomerNewDTO,
  ISystemUser,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { CreateEditCustomerDTO } from './CreateEditCustomerDTO';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class CreateCustomer {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private customerDTO: CreateEditCustomerDTO;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Creates a new customer.
   * @param  {number} tenantId
   * @param  {ICustomerNewDTO} customerDTO
   * @return {Promise<ICustomer>}
   */
  public async createCustomer(
    tenantId: number,
    customerDTO: ICustomerNewDTO,
    authorizedUser: ISystemUser
  ): Promise<ICustomer> {
    const { Contact } = this.tenancy.models(tenantId);

    // Transforms the customer DTO to customer object.
    const customerObj = await this.customerDTO.transformCreateDTO(
      tenantId,
      customerDTO
    );
    // Creates a new customer under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCustomerCreating` event.
      await this.eventPublisher.emitAsync(events.customers.onCreating, {
        tenantId,
        customerDTO,
        trx,
      } as ICustomerEventCreatingPayload);

      // Creates a new contact as customer.
      const customer = await Contact.query(trx).insertAndFetch({
        ...customerObj,
      });
      // Triggers `onCustomerCreated` event.
      await this.eventPublisher.emitAsync(events.customers.onCreated, {
        customer,
        tenantId,
        customerId: customer.id,
        authorizedUser,
        trx,
      } as ICustomerEventCreatedPayload);

      return customer;
    });
  }
}
