import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IVendorCreditCreatedPayload,
  IVendorCreditDeletedPayload,
  IVendorCreditEditedPayload,
} from '@/interfaces';
import VendorCreditInventoryTransactions from './VendorCreditInventoryTransactions';

@Service()
export default class VendorCreditInventoryTransactionsSubscriber {
  @Inject()
  private inventoryTransactions: VendorCreditInventoryTransactions;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  attach(bus) {
    bus.subscribe(
      events.vendorCredit.onCreated,
      this.writeInventoryTransactionsOnceCreated
    );
    bus.subscribe(
      events.vendorCredit.onOpened,
      this.writeInventoryTransactionsOnceCreated
    );
    bus.subscribe(
      events.vendorCredit.onEdited,
      this.rewriteInventroyTransactionsOnceEdited
    );
    bus.subscribe(
      events.vendorCredit.onDeleted,
      this.revertInventoryTransactionsOnceDeleted
    );
  }

  /**
   * Writes inventory transactions once vendor created created.
   * @param {IVendorCreditCreatedPayload} payload -
   */
  private writeInventoryTransactionsOnceCreated = async ({
    tenantId,
    vendorCredit,
    trx,
  }: IVendorCreditCreatedPayload) => {
    // Can't continue if vendor credit is not opened.
    if (!vendorCredit.openedAt) return null;

    await this.inventoryTransactions.createInventoryTransactions(
      tenantId,
      vendorCredit,
      trx
    );
  };

  /**
   * Rewrites inventory transactions once vendor credit edited.
   * @param {IVendorCreditEditedPayload} payload -
   */
  private rewriteInventroyTransactionsOnceEdited = async ({
    tenantId,
    vendorCreditId,
    vendorCredit,
    trx,
  }: IVendorCreditEditedPayload) => {
    // Can't continue if vendor credit is not opened.
    if (!vendorCredit.openedAt) return null;

    await this.inventoryTransactions.editInventoryTransactions(
      tenantId,
      vendorCreditId,
      vendorCredit,
      trx
    );
  };

  /**
   * Reverts inventory transactions once vendor credit deleted.
   * @param {IVendorCreditDeletedPayload} payload -
   */
  private revertInventoryTransactionsOnceDeleted = async ({
    tenantId,
    vendorCreditId,
    trx,
  }: IVendorCreditDeletedPayload) => {
    await this.inventoryTransactions.deleteInventoryTransactions(
      tenantId,
      vendorCreditId,
      trx
    );
  };
}
