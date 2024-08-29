import { Inject, Service } from 'typedi';
import { map, head } from 'lodash';
import events from '@/subscribers/events';
import InventoryItemsQuantitySync from '@/services/Inventory/InventoryItemsQuantitySync';
import InventoryService from '@/services/Inventory/Inventory';
import {
  IComputeItemCostJobCompletedPayload,
  IInventoryTransactionsCreatedPayload,
  IInventoryTransactionsDeletedPayload,
} from '@/interfaces';
import { runAfterTransaction } from '@/services/UnitOfWork/TransactionsHooks';
import { SaleInvoicesCost } from '@/services/Sales/Invoices/SalesInvoicesCost';
import { ImportAls } from '@/services/Import/ImportALS';

@Service()
export default class InventorySubscriber {
  @Inject()
  private saleInvoicesCost: SaleInvoicesCost;

  @Inject()
  private itemsQuantitySync: InventoryItemsQuantitySync;

  @Inject()
  private inventoryService: InventoryService;

  @Inject('agenda')
  private agenda: any;

  @Inject()
  private importAls: ImportAls;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.inventory.onInventoryTransactionsCreated,
      this.handleScheduleItemsCostOnInventoryTransactionsCreated
    );
    bus.subscribe(
      events.inventory.onInventoryTransactionsCreated,
      this.syncItemsQuantityOnceInventoryTransactionsCreated
    );
    bus.subscribe(
      events.inventory.onComputeItemCostJobScheduled,
      this.markGlobalSettingsComputeItems
    );
    bus.subscribe(
      events.inventory.onInventoryCostEntriesWritten,
      this.markGlobalSettingsComputeItemsCompeted
    );
    bus.subscribe(
      events.inventory.onComputeItemCostJobCompleted,
      this.onComputeItemCostJobFinished
    );
    bus.subscribe(
      events.inventory.onInventoryTransactionsDeleted,
      this.handleScheduleItemsCostOnInventoryTransactionsDeleted
    );
    bus.subscribe(
      events.inventory.onInventoryTransactionsDeleted,
      this.syncItemsQuantityOnceInventoryTransactionsDeleted
    );
  }

  /**
   * Sync inventory items quantity once inventory transactions created.
   * @param {IInventoryTransactionsCreatedPayload} payload -
   */
  private syncItemsQuantityOnceInventoryTransactionsCreated = async ({
    tenantId,
    inventoryTransactions,
    trx,
  }: IInventoryTransactionsCreatedPayload) => {
    const itemsQuantityChanges = this.itemsQuantitySync.getItemsQuantityChanges(
      inventoryTransactions
    );

    await this.itemsQuantitySync.changeItemsQuantity(
      tenantId,
      itemsQuantityChanges,
      trx
    );
  };

  /**
   * Handles schedule compute inventory items cost once inventory transactions created.
   * @param {IInventoryTransactionsCreatedPayload} payload -
   */
  private handleScheduleItemsCostOnInventoryTransactionsCreated = async ({
    tenantId,
    inventoryTransactions,
    trx,
  }: IInventoryTransactionsCreatedPayload) => {
    const inImportPreviewScope = this.importAls.isImportPreview;

    // Avoid running the cost items job if the async process is in import preview.
    if (inImportPreviewScope) return;

    await this.saleInvoicesCost.computeItemsCostByInventoryTransactions(
      tenantId,
      inventoryTransactions
    );
  };

  /**
   * Marks items cost compute running state.
   */
  private markGlobalSettingsComputeItems = async ({ tenantId }) => {
    await this.inventoryService.markItemsCostComputeRunning(tenantId, true);
  };

  /**
   * Marks items cost compute as completed.
   */
  private markGlobalSettingsComputeItemsCompeted = async ({ tenantId }) => {
    await this.inventoryService.markItemsCostComputeRunning(tenantId, false);
  };

  /**
   * Handle run writing the journal entries once the compute items jobs completed.
   */
  private onComputeItemCostJobFinished = async ({
    itemId,
    tenantId,
    startingDate,
  }: IComputeItemCostJobCompletedPayload) => {
    const dependsComputeJobs = await this.agenda.jobs({
      name: 'compute-item-cost',
      nextRunAt: { $ne: null },
      'data.tenantId': tenantId,
    });
    // There is no scheduled compute jobs waiting.
    if (dependsComputeJobs.length === 0) {
      await this.saleInvoicesCost.scheduleWriteJournalEntries(
        tenantId,
        startingDate
      );
    }
  };

  /**
   * Sync inventory items quantity once inventory transactions deleted.
   */
  private syncItemsQuantityOnceInventoryTransactionsDeleted = async ({
    tenantId,
    oldInventoryTransactions,
    trx,
  }: IInventoryTransactionsDeletedPayload) => {
    const itemsQuantityChanges =
      this.itemsQuantitySync.getReverseItemsQuantityChanges(
        oldInventoryTransactions
      );
    await this.itemsQuantitySync.changeItemsQuantity(
      tenantId,
      itemsQuantityChanges,
      trx
    );
  };

  /**
   * Schedules compute items cost once the inventory transactions deleted.
   */
  private handleScheduleItemsCostOnInventoryTransactionsDeleted = async ({
    tenantId,
    transactionType,
    transactionId,
    oldInventoryTransactions,
    trx,
  }: IInventoryTransactionsDeletedPayload) => {
    // Ignore compute item cost with theses transaction types.
    const ignoreWithTransactionTypes = ['OpeningItem'];

    if (ignoreWithTransactionTypes.indexOf(transactionType) !== -1) {
      return;
    }
    const inventoryItemsIds = map(oldInventoryTransactions, 'itemId');
    const startingDates = map(oldInventoryTransactions, 'date');
    const startingDate: Date = head(startingDates);

    runAfterTransaction(trx, async () => {
      try {
        await this.saleInvoicesCost.scheduleComputeCostByItemsIds(
          tenantId,
          inventoryItemsIds,
          startingDate
        );
      } catch (error) {
        console.error(error);
      }
    });
  };
}
