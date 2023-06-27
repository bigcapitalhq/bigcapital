import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import {
  ICustomer,
  ICustomerOpeningBalanceEditDTO,
  ICustomerOpeningBalanceEditedPayload,
  ICustomerOpeningBalanceEditingPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';

@Service()
export class EditOpeningBalanceCustomer {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Changes the opening balance of the given customer.
   * @param {number} tenantId
   * @param {number} customerId
   * @param {number} openingBalance
   * @param {string|Date} openingBalanceAt
   */
  public async changeOpeningBalance(
    tenantId: number,
    customerId: number,
    openingBalanceEditDTO: ICustomerOpeningBalanceEditDTO
  ): Promise<ICustomer> {
    const { Customer } = this.tenancy.models(tenantId);

    // Retrieves the old customer or throw not found error.
    const oldCustomer = await Customer.query()
      .findById(customerId)
      .throwIfNotFound();

    // Mutates the customer opening balance under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCustomerOpeningBalanceChanging` event.
      await this.eventPublisher.emitAsync(
        events.customers.onOpeningBalanceChanging,
        {
          tenantId,
          oldCustomer,
          openingBalanceEditDTO,
          trx,
        } as ICustomerOpeningBalanceEditingPayload
      );
      // Mutates the customer on the storage.
      const customer = await Customer.query().patchAndFetchById(customerId, {
        ...openingBalanceEditDTO,
      });
      // Triggers `onCustomerOpeningBalanceChanged` event.
      await this.eventPublisher.emitAsync(
        events.customers.onOpeningBalanceChanged,
        {
          tenantId,
          customer,
          oldCustomer,
          openingBalanceEditDTO,
          trx,
        } as ICustomerOpeningBalanceEditedPayload
      );
      return customer;
    });
  }
}
