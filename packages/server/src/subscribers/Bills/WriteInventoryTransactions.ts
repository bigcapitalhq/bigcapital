import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import BillsService from '@/services/Purchases/Bills';
import {
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
} from '@/interfaces';

@Service()
export default class BillWriteInventoryTransactionsSubscriber {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  billsService: BillsService;

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
    await this.billsService.recordInventoryTransactions(
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
    await this.billsService.recordInventoryTransactions(
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
    await this.billsService.revertInventoryTransactions(tenantId, billId, trx);
  };
}
