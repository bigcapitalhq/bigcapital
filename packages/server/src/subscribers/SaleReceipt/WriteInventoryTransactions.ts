import { Inject } from 'typedi';
import { EventSubscriber } from 'event-dispatch';
import events from '@/subscribers/events';
import {
  ISaleReceiptCreatedPayload,
  ISaleReceiptEditedPayload,
  ISaleReceiptEventDeletedPayload,
} from '@/interfaces';
import { SaleReceiptInventoryTransactions } from '@/services/Sales/Receipts/SaleReceiptInventoryTransactions';

@EventSubscriber()
export default class SaleReceiptInventoryTransactionsSubscriber {
  @Inject()
  private saleReceiptInventory: SaleReceiptInventoryTransactions;

  /**
   * Subscribe events to handles.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleReceipt.onCreated,
      this.handleWritingInventoryTransactions
    );
    bus.subscribe(
      events.saleReceipt.onEdited,
      this.handleRewritingInventoryTransactions
    );
    bus.subscribe(
      events.saleReceipt.onDeleted,
      this.handleDeletingInventoryTransactions
    );
  }

  /**
   * Handles the writing inventory transactions once the receipt created.
   * @param {ISaleReceiptCreatedPayload} payload -
   */
  private handleWritingInventoryTransactions = async ({
    tenantId,
    saleReceipt,
    trx,
  }: ISaleReceiptCreatedPayload) => {
    // Can't continue if the sale receipt is not closed yet.
    if (!saleReceipt.closedAt) return null;

    await this.saleReceiptInventory.recordInventoryTransactions(
      tenantId,
      saleReceipt,
      false,
      trx
    );
  };

  /**
   * Rewriting the inventory transactions once the sale invoice be edited.
   * @param {ISaleReceiptEditedPayload} payload -
   */
  private handleRewritingInventoryTransactions = async ({
    tenantId,
    saleReceipt,
    trx,
  }: ISaleReceiptEditedPayload) => {
    // Can't continue if the sale receipt is not closed yet.
    if (!saleReceipt.closedAt) return null;

    await this.saleReceiptInventory.recordInventoryTransactions(
      tenantId,
      saleReceipt,
      true,
      trx
    );
  };

  /**
   * Handles deleting the inventory transactions once the receipt deleted.
   * @param {ISaleReceiptEventDeletedPayload} payload -
   */
  private handleDeletingInventoryTransactions = async ({
    tenantId,
    saleReceiptId,
    trx,
  }: ISaleReceiptEventDeletedPayload) => {
    await this.saleReceiptInventory.revertInventoryTransactions(
      tenantId,
      saleReceiptId,
      trx
    );
  };
}
