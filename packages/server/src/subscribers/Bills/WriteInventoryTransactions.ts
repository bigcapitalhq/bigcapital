import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import {
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
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
   */
  private handleWritingInventoryTransactions = async ({
    tenantId,
    billId,
    trx,
  }: IBillCreatedPayload) => {
    await this.billsInventory.recordInventoryTransactions(
      tenantId,
      billId,
      false,
      trx
    );
  };

  /**
   * Handles the overwriting the inventory transactions once bill edited.
   */
  private handleOverwritingInventoryTransactions = async ({
    tenantId,
    billId,
    trx,
  }: IBillEditedPayload) => {
    await this.billsInventory.recordInventoryTransactions(
      tenantId,
      billId,
      true,
      trx
    );
  };

  /**
   * Handles the reverting the inventory transactions once the bill deleted.
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
