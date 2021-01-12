import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { map, head } from 'lodash';
import events from 'subscribers/events';
import SaleInvoicesCost from 'services/Sales/SalesInvoicesCost';

@EventSubscriber()
export class InventorySubscriber {
  depends: number = 0;
  startingDate: Date;
  saleInvoicesCost: SaleInvoicesCost;
  agenda: any;

  constructor() {
    this.saleInvoicesCost = Container.get(SaleInvoicesCost);
    this.agenda = Container.get('agenda');
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
   * 
   */
  @On(events.inventory.onInventoryTransactionsCreated)
  async handleScheduleItemsCostOnInventoryTransactionsCreated({
    tenantId,
    inventoryTransactions
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
    oldInventoryTransactions
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
