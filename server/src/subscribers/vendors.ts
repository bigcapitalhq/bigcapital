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

  /**
   * Writes the open balance journal entries once the vendor created.
   */
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

  /**
   * Revert the opening balance journal entries once the vendor deleted.
   */
  @On(events.vendors.onDeleted)
  async handleRevertOpeningBalanceEntries({ tenantId, vendorId }) {
    await this.vendorsService.revertOpeningBalanceEntries(
      tenantId, vendorId,
    );
  }

  /**
   * Revert the opening balance journal entries once the vendors deleted in bulk.
   */
  @On(events.vendors.onBulkDeleted)
  async handleBulkRevertOpeningBalanceEntries({ tenantId, vendorsIds }) {
    await this.vendorsService.revertOpeningBalanceEntries(
      tenantId, vendorsIds,
    );
  }
}