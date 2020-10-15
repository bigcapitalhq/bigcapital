import { Container, Inject, Service } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import CustomersService from 'services/Contacts/CustomersService';

@EventSubscriber()
export default class CustomersSubscriber {
  logger: any;
  tenancy: TenancyService;
  customersService: CustomersService;

  constructor() {
    this.logger = Container.get('logger');
    this.customersService = Container.get(CustomersService);
  }

  @On(events.customers.onCreated)
  async handleWriteOpenBalanceEntries({ tenantId, customerId, customer }) {

    // Writes the customer opening balance journal entries.
    if (customer.openingBalance) {
      await this.customersService.writeCustomerOpeningBalanceJournal(
        tenantId,
        customer.id,
        customer.openingBalance,
      );
    }
  }

  @On(events.customers.onDeleted)
  async handleRevertOpeningBalanceEntries({ tenantId, customerId }) {

    await this.customersService.revertOpeningBalanceEntries(
      tenantId, customerId,
    );
  }

  @On(events.customers.onBulkDeleted)
  async handleBulkRevertOpeningBalanceEntries({ tenantId, customersIds }) {

    await this.customersService.revertOpeningBalanceEntries(
      tenantId, customersIds,
    );
  }
}