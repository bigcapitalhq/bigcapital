import { Injectable } from '@nestjs/common';
import {
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
  IBillOpenedPayload,
} from '../Bills.types';
import { BillInventoryTransactions } from '../commands/BillInventoryTransactions';
import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BillWriteInventoryTransactionsSubscriber {
  constructor(private readonly billsInventory: BillInventoryTransactions) {}

  /**
   * Handles writing the inventory transactions once bill created.
   * @param {IBillCreatedPayload | IBillOpenedPayload} payload -
   */
  @OnEvent(events.bill.onCreated)
  @OnEvent(events.bill.onOpened)
  public async handleWritingInventoryTransactions({
    bill,
    trx,
  }: IBillCreatedPayload | IBillOpenedPayload) {
    // Can't continue if the bill is not opened yet.
    if (!bill.openedAt) return null;

    await this.billsInventory.recordInventoryTransactions(bill.id, false, trx);
  }

  /**
   * Handles the overwriting the inventory transactions once bill edited.
   * @param {IBillEditedPayload} payload -
   */
  @OnEvent(events.bill.onEdited)
  public async handleOverwritingInventoryTransactions({
    bill,
    trx,
  }: IBillEditedPayload) {
    // Can't continue if the bill is not opened yet.
    if (!bill.openedAt) return null;

    await this.billsInventory.recordInventoryTransactions(bill.id, true, trx);
  };

  /**
   * Handles the reverting the inventory transactions once the bill deleted.
   * @param {IBIllEventDeletedPayload} payload -
   */
  @OnEvent(events.bill.onDeleted)
  public async handleRevertInventoryTransactions({
    billId,
    trx,
  }: IBIllEventDeletedPayload) {
    await this.billsInventory.revertInventoryTransactions(billId, trx);
  }
}
