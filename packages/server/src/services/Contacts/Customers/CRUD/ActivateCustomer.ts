import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { CustomerValidators } from './CustomerValidators';
import {
  ICustomerActivatingPayload,
  ICustomerActivatedPayload,
} from '@/interfaces';

@Service()
export class ActivateCustomer {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: CustomerValidators;

  /**
   * Inactive the given contact.
   * @param   {number} tenantId - Tenant id.
   * @param   {number} contactId - Contact id.
   * @returns {Promise<void>}
   */
  public async activateCustomer(
    tenantId: number,
    customerId: number
  ): Promise<void> {
    const { Contact } = this.tenancy.models(tenantId);

    // Retrieves the customer or throw not found error.
    const oldCustomer = await Contact.query()
      .findById(customerId)
      .modify('customer')
      .throwIfNotFound();

    this.validators.validateNotAlreadyPublished(oldCustomer);

    // Edits the given customer with associated transactions on unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCustomerActivating` event.
      await this.eventPublisher.emitAsync(events.customers.onActivating, {
        tenantId,
        trx,
        oldCustomer,
      } as ICustomerActivatingPayload);

      // Update the given customer details.
      const customer = await Contact.query(trx)
        .findById(customerId)
        .update({ active: true });

      // Triggers `onCustomerActivated` event.
      await this.eventPublisher.emitAsync(events.customers.onActivated, {
        tenantId,
        trx,
        oldCustomer,
        customer,
      } as ICustomerActivatedPayload);
    });
  }
}
