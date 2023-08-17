import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import {
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
  IBillOpenedPayload,
} from '@/interfaces';
import { BillInventoryTransactions } from '@/services/Purchases/Bills/BillInventoryTransactions';

@Service()
export default class BillWriteInventoryTransactionsSubscriber {
  @Inject()
  private billsInventory: BillInventoryTransactions;

  /**
   * Attaches events with handles.
   */
  public attach(bus) {
    bus.subscribe(
      events.bill.onCreated,
      this.handleWritingInventoryTransactions
    );
    bus.subscribe(
      events.bill.onOpened,
      this.handleWritingInventoryTransactions
    );
    bus.subscribe(
      events.bill.onEdited,
      this.handleOverwritingInventoryTransactions
    );
    bus.subscribe(
      events.bill.onDeleted,
      this.handleRevertInventoryTransactions
    );
  }

  /**
   * Handles writing the inventory transactions once bill created.
   * @param {IBillCreatedPayload | IBillOpenedPayload} payload -
   */
  private handleWritingInventoryTransactions = async ({
    tenantId,
    bill,
    trx,
  }: IBillCreatedPayload | IBillOpenedPayload) => {
    // Can't continue if the bill is not opened yet.
    if (!bill.openedAt) return null;

    await this.billsInventory.recordInventoryTransactions(
      tenantId,
      bill.id,
      false,
      trx
    );
  };

  /**
   * Handles the overwriting the inventory transactions once bill edited.
   * @param {IBillEditedPayload} payload -
   */
  private handleOverwritingInventoryTransactions = async ({
    tenantId,
    billId,
    bill,
    trx,
  }: IBillEditedPayload) => {
    // Can't continue if the bill is not opened yet.
    if (!bill.openedAt) return null;

    await this.billsInventory.recordInventoryTransactions(
      tenantId,
      billId,
      true,
      trx
    );
  };

  /**
   * Handles the reverting the inventory transactions once the bill deleted.
   * @param {IBIllEventDeletedPayload} payload -
   */
  private handleRevertInventoryTransactions = async ({
    tenantId,
    billId,
    trx,
  }: IBIllEventDeletedPayload) => {
    await this.billsInventory.revertInventoryTransactions(
      tenantId,
      billId,
      trx
    );
  };
}
