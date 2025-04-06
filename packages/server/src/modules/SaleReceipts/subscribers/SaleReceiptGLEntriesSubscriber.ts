import { Inject, Injectable } from '@nestjs/common';
import {
  ISaleReceiptCreatedPayload,
  ISaleReceiptEditedPayload,
  ISaleReceiptEventDeletedPayload,
} from '../types/SaleReceipts.types';
import { SaleReceiptGLEntries } from '../ledger/SaleReceiptGLEntries';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class SaleReceiptGLEntriesSubscriber {
  constructor(private readonly saleReceiptGLEntries: SaleReceiptGLEntries) {}

  /**
   * Handles writing sale receipt income journal entries once created.
   * @param {ISaleReceiptCreatedPayload} payload -
   */
  @OnEvent(events.saleReceipt.onCreated)
  @OnEvent(events.saleReceipt.onClosed)
  public async handleWriteReceiptIncomeJournalEntrieOnCreate({
    saleReceiptId,
    saleReceipt,
    trx,
  }: ISaleReceiptCreatedPayload) {
    // Can't continue if the sale receipt is not closed yet.
    if (!saleReceipt.closedAt) return null;

    // Writes the sale receipt income journal entries.
    await this.saleReceiptGLEntries.writeIncomeGLEntries(saleReceiptId, trx);
  }

  /**
   * Handles sale receipt revert jouranl entries once be deleted.
   * @param {ISaleReceiptEventDeletedPayload} payload -
   */
  @OnEvent(events.saleReceipt.onDeleted)
  public async handleRevertReceiptJournalEntriesOnDeleted({
    saleReceiptId,
    trx,
  }: ISaleReceiptEventDeletedPayload) {
    await this.saleReceiptGLEntries.revertReceiptGLEntries(saleReceiptId, trx);
  }

  /**
   * Handles writing sale receipt income journal entries once be edited.
   * @param {ISaleReceiptEditedPayload} payload -
   */
  @OnEvent(events.saleReceipt.onEdited)
  public async handleWriteReceiptIncomeJournalEntrieOnEdited({
    saleReceipt,
    trx,
  }: ISaleReceiptEditedPayload) {
    // Can't continue if the sale receipt is not closed yet.
    if (!saleReceipt.closedAt) return null;

    // Writes the sale receipt income journal entries.
    await this.saleReceiptGLEntries.rewriteReceiptGLEntries(
      saleReceipt.id,
      trx,
    );
  }
}
