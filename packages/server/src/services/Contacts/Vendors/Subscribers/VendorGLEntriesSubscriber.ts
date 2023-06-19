import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { VendorGLEntriesStorage } from '../VendorGLEntriesStorage';
import {
  IVendorEventCreatedPayload,
  IVendorEventDeletedPayload,
  IVendorOpeningBalanceEditedPayload,
} from '@/interfaces';

@Service()
export class VendorsWriteGLOpeningSubscriber {
  @Inject()
  private vendorGLEntriesStorage: VendorGLEntriesStorage;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.vendors.onCreated,
      this.handleWriteOpeningBalanceEntries
    );
    bus.subscribe(
      events.vendors.onDeleted,
      this.handleRevertOpeningBalanceEntries
    );
    bus.subscribe(
      events.vendors.onOpeningBalanceChanged,
      this.handleRewriteOpeningEntriesOnChanged
    );
  }

  /**
   * Writes the open balance journal entries once the vendor created.
   * @param {IVendorEventCreatedPayload} payload -
   */
  private handleWriteOpeningBalanceEntries = async ({
    tenantId,
    vendor,
    trx,
  }: IVendorEventCreatedPayload) => {
    // Writes the vendor opening balance journal entries.
    if (vendor.openingBalance) {
      await this.vendorGLEntriesStorage.writeVendorOpeningBalance(
        tenantId,
        vendor.id,
        trx
      );
    }
  };

  /**
   * Revert the opening balance journal entries once the vendor deleted.
   * @param {IVendorEventDeletedPayload} payload -
   */
  private handleRevertOpeningBalanceEntries = async ({
    tenantId,
    vendorId,
    trx,
  }: IVendorEventDeletedPayload) => {
    await this.vendorGLEntriesStorage.revertVendorOpeningBalance(
      tenantId,
      vendorId,
      trx
    );
  };

  /**
   * Handles the rewrite opening balance entries once opening balance changed.
   * @param {ICustomerOpeningBalanceEditedPayload} payload -
   */
  private handleRewriteOpeningEntriesOnChanged = async ({
    tenantId,
    vendor,
    trx,
  }: IVendorOpeningBalanceEditedPayload) => {
    if (vendor.openingBalance) {
      await this.vendorGLEntriesStorage.rewriteVendorOpeningBalance(
        tenantId,
        vendor.id,
        trx
      );
    } else {
      await this.vendorGLEntriesStorage.revertVendorOpeningBalance(
        tenantId,
        vendor.id,
        trx
      );
    }
  };
}
