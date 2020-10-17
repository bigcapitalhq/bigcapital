import { Container, Inject, Service } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import VendorsService from 'services/Contacts/VendorsService';

@EventSubscriber()
export default class VendorsSubscriber {
  logger: any;
  tenancy: TenancyService;
  vendorsService: VendorsService;

  /**
   * Constructor method.
   */
  constructor() {
    this.logger = Container.get('logger');
    this.vendorsService = Container.get(VendorsService);
  }

  @On(events.vendors.onCreated)
  async handleWriteOpeningBalanceEntries({ tenantId, vendorId, vendor }) {
    // Writes the vendor opening balance journal entries.
    if (vendor.openingBalance) {
      await this.vendorsService.writeVendorOpeningBalanceJournal(
        tenantId,
        vendor.id,
        vendor.openingBalance,
      );
    }
  }

  @On(events.vendors.onDeleted)
  async handleRevertOpeningBalanceEntries({ tenantId, vendorId }) {
    await this.vendorsService.revertOpeningBalanceEntries(
      tenantId, vendorId,
    );
  }

  @On(events.vendors.onBulkDeleted)
  async handleBulkRevertOpeningBalanceEntries({ tenantId, vendorsIds }) {
    await this.vendorsService.revertOpeningBalanceEntries(
      tenantId, vendorsIds,
    );
  }
}