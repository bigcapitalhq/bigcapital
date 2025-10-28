import {
  IVendorCreditCreatedPayload,
  IVendorCreditDeletedPayload,
  IVendorCreditEditedPayload,
} from '../types/VendorCredit.types';
import { VendorCreditInventoryTransactions } from '../commands/VendorCreditInventoryTransactions';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';

@Injectable()
export class VendorCreditInventoryTransactionsSubscriber {
  constructor(
    private readonly inventoryTransactions: VendorCreditInventoryTransactions,
  ) {}
  /**
   * Writes inventory transactions once vendor created created.
   * @param {IVendorCreditCreatedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onCreated)
  @OnEvent(events.vendorCredit.onOpened)
  public async writeInventoryTransactionsOnceCreated({
    vendorCredit,
    trx,
  }: IVendorCreditCreatedPayload) {
    // Can't continue if vendor credit is not opened.
    if (!vendorCredit.openedAt) return null;

    await this.inventoryTransactions.createInventoryTransactions(
      vendorCredit,
      trx,
    );
  }

  /**
   * Rewrites inventory transactions once vendor credit edited.
   * @param {IVendorCreditEditedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onEdited)
  public async rewriteInventroyTransactionsOnceEdited({
    oldVendorCredit,
    vendorCredit,
    trx,
  }: IVendorCreditEditedPayload) {
    // Can't continue if vendor credit is not opened.
    if (!vendorCredit.openedAt) return null;

    await this.inventoryTransactions.editInventoryTransactions(
      oldVendorCredit.id,
      vendorCredit,
      trx,
    );
  }

  /**
   * Reverts inventory transactions once vendor credit deleted.
   * @param {IVendorCreditDeletedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onDeleted)
  public async revertInventoryTransactionsOnceDeleted({
    vendorCreditId,
    trx,
  }: IVendorCreditDeletedPayload) {
    await this.inventoryTransactions.deleteInventoryTransactions(
      vendorCreditId,
      trx,
    );
  }
}
