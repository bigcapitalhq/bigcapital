import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  ISaleReceiptCreatedPayload,
  ISaleReceiptEditedPayload,
  ISaleReceiptEventDeletedPayload,
} from '@/interfaces';
import { SaleReceiptGLEntries } from '@/services/Sales/Receipts/SaleReceiptGLEntries';

@Service()
export default class SaleReceiptWriteGLEntriesSubscriber {
  @Inject()
  private saleReceiptGLEntries: SaleReceiptGLEntries;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleReceipt.onCreated,
      this.handleWriteReceiptIncomeJournalEntrieOnCreate
    );
    bus.subscribe(
      events.saleReceipt.onClosed,
      this.handleWriteReceiptIncomeJournalEntrieOnCreate
    );
    bus.subscribe(
      events.saleReceipt.onEdited,
      this.handleWriteReceiptIncomeJournalEntrieOnEdited
    );
    bus.subscribe(
      events.saleReceipt.onDeleted,
      this.handleRevertReceiptJournalEntriesOnDeleted
    );
  }

  /**
   * Handles writing sale receipt income journal entries once created.
   * @param {ISaleReceiptCreatedPayload} payload -
   */
  public handleWriteReceiptIncomeJournalEntrieOnCreate = async ({
    tenantId,
    saleReceiptId,
    saleReceipt,
    trx,
  }: ISaleReceiptCreatedPayload) => {
    // Can't continue if the sale receipt is not closed yet.
    if (!saleReceipt.closedAt) return null;

    // Writes the sale receipt income journal entries.
    await this.saleReceiptGLEntries.writeIncomeGLEntries(
      tenantId,
      saleReceiptId,
      trx
    );
  };

  /**
   * Handles sale receipt revert jouranl entries once be deleted.
   * @param {ISaleReceiptEventDeletedPayload} payload -
   */
  public handleRevertReceiptJournalEntriesOnDeleted = async ({
    tenantId,
    saleReceiptId,
    trx,
  }: ISaleReceiptEventDeletedPayload) => {
    await this.saleReceiptGLEntries.revertReceiptGLEntries(
      tenantId,
      saleReceiptId,
      trx
    );
  };

  /**
   * Handles writing sale receipt income journal entries once be edited.
   * @param {ISaleReceiptEditedPayload} payload -
   */
  private handleWriteReceiptIncomeJournalEntrieOnEdited = async ({
    tenantId,
    saleReceiptId,
    saleReceipt,
    trx,
  }: ISaleReceiptEditedPayload) => {
    // Can't continue if the sale receipt is not closed yet.
    if (!saleReceipt.closedAt) return null;

    // Writes the sale receipt income journal entries.
    await this.saleReceiptGLEntries.rewriteReceiptGLEntries(
      tenantId,
      saleReceiptId,
      trx
    );
  };
}
