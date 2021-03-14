import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { map, head } from 'lodash';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import SaleInvoicesCost from 'services/Sales/SalesInvoicesCost';
import InventoryItemsQuantitySync from 'services/Inventory/InventoryItemsQuantitySync';
import InventoryService from 'services/Inventory/Inventory';

@EventSubscriber()
export class InventorySubscriber {
  depends: number = 0;
  startingDate: Date;
  saleInvoicesCost: SaleInvoicesCost;
  tenancy: TenancyService;
  itemsQuantitySync: InventoryItemsQuantitySync;
  inventoryService: InventoryService;
  agenda: any;

  /**
   * Constructor method.
   */
  constructor() {
    this.saleInvoicesCost = Container.get(SaleInvoicesCost);
    this.itemsQuantitySync = Container.get(InventoryItemsQuantitySync);
    this.inventoryService = Container.get(InventoryService);
    this.tenancy = Container.get(TenancyService);
    this.agenda = Container.get('agenda');
  }

  /**
   * Marks items cost compute running state.
   */
  @On(events.inventory.onComputeItemCostJobScheduled)
  async markGlobalSettingsComputeItems({
    tenantId
  }) {
    await this.inventoryService.markItemsCostComputeRunning(tenantId, true);
  }

  /**
   * Marks items cost compute as completed.
   */
  @On(events.inventory.onInventoryCostEntriesWritten)
  async markGlobalSettingsComputeItemsCompeted({
    tenantId
  }) {
    await this.inventoryService.markItemsCostComputeRunning(tenantId, false);
  }

  /**
   * Handle run writing the journal entries once the compute items jobs completed.
   */
  @On(events.inventory.onComputeItemCostJobCompleted)
  async onComputeItemCostJobFinished({ itemId, tenantId, startingDate }) {
    const dependsComputeJobs = await this.agenda.jobs({
      name: 'compute-item-cost',
      nextRunAt: { $ne: null },
      'data.tenantId': tenantId,
    });
    // There is no scheduled compute jobs waiting.
    if (dependsComputeJobs.length === 0) {
      this.startingDate = null;

      await this.saleInvoicesCost.scheduleWriteJournalEntries(
        tenantId,
        startingDate
      );
    }
  }

  /**
   * Sync inventory items quantity once inventory transactions created.
   */
  @On(events.inventory.onInventoryTransactionsCreated)
  async syncItemsQuantityOnceInventoryTransactionsCreated({
    tenantId,
    inventoryTransactions,
  }) {
    const itemsQuantityChanges = this.itemsQuantitySync.getItemsQuantityChanges(
      inventoryTransactions
    );
    await this.itemsQuantitySync.changeItemsQuantity(
      tenantId,
      itemsQuantityChanges
    );
  }

  /**
   * Sync inventory items quantity once inventory transactions deleted.
   */
  @On(events.inventory.onInventoryTransactionsDeleted)
  async syncItemsQuantityOnceInventoryTransactionsDeleted({
    tenantId,
    oldInventoryTransactions,
  }) {
    const itemsQuantityChanges = this.itemsQuantitySync.getReverseItemsQuantityChanges(
      oldInventoryTransactions
    );
    await this.itemsQuantitySync.changeItemsQuantity(
      tenantId,
      itemsQuantityChanges
    );
  }

  /**
   *
   */
  @On(events.inventory.onInventoryTransactionsCreated)
  async handleScheduleItemsCostOnInventoryTransactionsCreated({
    tenantId,
    inventoryTransactions,
  }) {
    const inventoryItemsIds = map(inventoryTransactions, 'itemId');

    await this.saleInvoicesCost.computeItemsCostByInventoryTransactions(
      tenantId,
      inventoryTransactions
    );
  }

  /**
   * Schedules compute items cost once the inventory transactions deleted.
   */
  @On(events.inventory.onInventoryTransactionsDeleted)
  async handleScheduleItemsCostOnInventoryTransactionsDeleted({
    tenantId,
    transactionType,
    transactionId,
    oldInventoryTransactions,
  }) {
    // Ignore compute item cost with theses transaction types.
    const ignoreWithTransactionTypes = ['OpeningItem'];

    if (ignoreWithTransactionTypes.indexOf(transactionType) !== -1) {
      return;
    }
    const inventoryItemsIds = map(oldInventoryTransactions, 'itemId');
    const startingDates = map(oldInventoryTransactions, 'date');
    const startingDate = head(startingDates);

    await this.saleInvoicesCost.scheduleComputeCostByItemsIds(
      tenantId,
      inventoryItemsIds,
      startingDate
    );
  }
}
