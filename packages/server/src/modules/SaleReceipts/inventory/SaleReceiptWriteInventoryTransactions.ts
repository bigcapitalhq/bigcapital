import { OnEvent } from '@nestjs/event-emitter';
import {
  ISaleReceiptCreatedPayload,
  ISaleReceiptEditedPayload,
  ISaleReceiptEventDeletedPayload,
} from '../types/SaleReceipts.types';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { SaleReceiptInventoryTransactions } from './SaleReceiptInventoryTransactions';

@Injectable()
export class SaleReceiptInventoryTransactionsSubscriber {
  constructor(
    private readonly saleReceiptInventory: SaleReceiptInventoryTransactions
  ) {}

  /**
   * Handles the writing inventory transactions once the receipt created.
   * @param {ISaleReceiptCreatedPayload} payload -
   */
  @OnEvent(events.saleReceipt.onCreated)
  public async handleWritingInventoryTransactions({
    saleReceipt,
    trx,
  }: ISaleReceiptCreatedPayload) {
    // Can't continue if the sale receipt is not closed yet.
    if (!saleReceipt.closedAt) return null;

    await this.saleReceiptInventory.recordInventoryTransactions(
      saleReceipt,
      false,
      trx
    );
  };

  /**
   * Rewriting the inventory transactions once the sale invoice be edited.
   * @param {ISaleReceiptEditedPayload} payload -
   */
  @OnEvent(events.saleReceipt.onEdited)
  public async handleRewritingInventoryTransactions({
    saleReceipt,
    trx,
  }: ISaleReceiptEditedPayload) {
    // Can't continue if the sale receipt is not closed yet.
    if (!saleReceipt.closedAt) return null;

    await this.saleReceiptInventory.recordInventoryTransactions(
      saleReceipt,
      true,
      trx
    );
  };

  /**
   * Handles deleting the inventory transactions once the receipt deleted.
   * @param {ISaleReceiptEventDeletedPayload} payload -
   */
  @OnEvent(events.saleReceipt.onDeleted)
  public async handleDeletingInventoryTransactions({
    saleReceiptId,
    trx,
  }: ISaleReceiptEventDeletedPayload) {
    await this.saleReceiptInventory.revertInventoryTransactions(
      saleReceiptId,
      trx
    );
  };
}
