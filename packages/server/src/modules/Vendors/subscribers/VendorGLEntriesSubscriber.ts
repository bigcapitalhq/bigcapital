import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { VendorGLEntriesStorage } from '../VendorGLEntriesStorage';
import {
  IVendorEventCreatedPayload,
  IVendorEventDeletedPayload,
  IVendorOpeningBalanceEditedPayload,
} from '../types/Vendors.types';

@Injectable()
export class VendorsWriteGLOpeningSubscriber {
  constructor(
    private readonly vendorGLEntriesStorage: VendorGLEntriesStorage,
  ) {}

  /**
   * Writes the open balance journal entries once the vendor created.
   * @param {IVendorEventCreatedPayload} payload -
   */
  @OnEvent(events.vendors.onCreated)
  public async handleWriteOpeningBalanceEntries({
    vendor,
    trx,
  }: IVendorEventCreatedPayload) {
    // Writes the vendor opening balance journal entries.
    if (vendor.openingBalance) {
      await this.vendorGLEntriesStorage.writeVendorOpeningBalance(
        vendor.id,
        trx,
      );
    }
  }

  /**
   * Revert the opening balance journal entries once the vendor deleted.
   * @param {IVendorEventDeletedPayload} payload -
   */
  @OnEvent(events.vendors.onDeleted)
  public async handleRevertOpeningBalanceEntries({
    vendorId,
    trx,
  }: IVendorEventDeletedPayload) {
    await this.vendorGLEntriesStorage.revertVendorOpeningBalance(
      vendorId,
      trx,
    );
  }

  /**
   * Handles the rewrite opening balance entries once opening balance changed.
   * @param {IVendorOpeningBalanceEditedPayload} payload -
   */
  @OnEvent(events.vendors.onOpeningBalanceChanged)
  public async handleRewriteOpeningEntriesOnChanged({
    vendor,
    trx,
  }: IVendorOpeningBalanceEditedPayload) {
    if (vendor.openingBalance) {
      await this.vendorGLEntriesStorage.rewriteVendorOpeningBalance(
        vendor.id,
        trx,
      );
    } else {
      await this.vendorGLEntriesStorage.revertVendorOpeningBalance(
        vendor.id,
        trx,
      );
    }
  }
}
