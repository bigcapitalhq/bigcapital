import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import {
  ICustomerDeletingPayload,
  ICustomerEventDeletedPayload,
  ISystemUser,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from '../constants';

@Service()
export class DeleteCustomer {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Deletes the given customer from the storage.
   * @param {number} tenantId
   * @param {number} customerId
   * @return {Promise<void>}
   */
  public async deleteCustomer(
    tenantId: number,
    customerId: number,
    authorizedUser: ISystemUser
  ): Promise<void> {
    const { Contact } = this.tenancy.models(tenantId);

    // Retrieve the customer of throw not found service error.
    const oldCustomer = await Contact.query()
      .findById(customerId)
      .modify('customer')
      .throwIfNotFound()
      .queryAndThrowIfHasRelations({
        type: ERRORS.CUSTOMER_HAS_TRANSACTIONS,
      });

    // Triggers `onCustomerDeleting` event.
    await this.eventPublisher.emitAsync(events.customers.onDeleting, {
      tenantId,
      customerId,
      oldCustomer,
    } as ICustomerDeletingPayload);

    // Deletes the customer and associated entities under UOW transaction.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Delete the customer from the storage.
      await Contact.query(trx).findById(customerId).delete();

      // Throws `onCustomerDeleted` event.
      await this.eventPublisher.emitAsync(events.customers.onDeleted, {
        tenantId,
        customerId,
        oldCustomer,
        authorizedUser,
        trx,
      } as ICustomerEventDeletedPayload);
    });
  }
}
