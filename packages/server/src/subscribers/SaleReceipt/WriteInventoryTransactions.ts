import { Inject } from 'typedi';
import { EventSubscriber } from 'event-dispatch';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import SalesReceiptService from '@/services/Sales/SalesReceipts';
import {
  ISaleReceiptCreatedPayload,
  ISaleReceiptEditedPayload,
  ISaleReceiptEventDeletedPayload,
} from '@/interfaces';

@EventSubscriber()
export default class SaleReceiptInventoryTransactionsSubscriber {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  saleReceiptsService: SalesReceiptService;

  /**
   * Subscribe events to handles.
   */
  attach(bus) {
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
    await this.saleReceiptsService.recordInventoryTransactions(
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
    await this.saleReceiptsService.recordInventoryTransactions(
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
    await this.saleReceiptsService.revertInventoryTransactions(
      tenantId,
      saleReceiptId,
      trx
    );
  };
}
