import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import SalesReceiptService from '@/services/Sales/SalesReceipts';
import {
  ISaleReceiptCreatedPayload,
  ISaleReceiptEditedPayload,
  ISaleReceiptEventDeletedPayload,
} from '@/interfaces';
import { SaleReceiptGLEntries } from '@/services/Sales/SaleReceiptGLEntries';

@Service()
export default class SaleReceiptWriteGLEntriesSubscriber {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  saleReceiptGLEntries: SaleReceiptGLEntries;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleReceipt.onCreated,
      this.handleWriteReceiptIncomeJournalEntriesOnCreate
    );
    bus.subscribe(
      events.saleReceipt.onEdited,
      this.handleWriteReceiptIncomeJournalEntriesOnEdited
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
  public handleWriteReceiptIncomeJournalEntriesOnCreate = async ({
    tenantId,
    saleReceiptId,
    trx,
  }: ISaleReceiptCreatedPayload) => {
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
  private handleWriteReceiptIncomeJournalEntriesOnEdited = async ({
    tenantId,
    saleReceiptId,
    trx,
  }: ISaleReceiptEditedPayload) => {
    // Writes the sale receipt income journal entries.
    await this.saleReceiptGLEntries.rewriteReceiptGLEntries(
      tenantId,
      saleReceiptId,
      trx
    );
  };
}
