import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import SaleInvoicesCost from 'services/Sales/SalesInvoicesCost';

@EventSubscriber()
export class InventorySubscriber {
  depends: number = 0;
  startingDate: Date;

  /**
   * Handle run writing the journal entries once the compute items jobs completed.
   */
  @On(events.inventory.onComputeItemCostJobCompleted)
  async onComputeItemCostJobFinished({ itemId, tenantId, startingDate }) {
    const saleInvoicesCost = Container.get(SaleInvoicesCost);
    const agenda = Container.get('agenda');

    const dependsComputeJobs = await agenda.jobs({
      name: 'compute-item-cost',
      nextRunAt: { $ne: null },
      'data.tenantId': tenantId,
    });
    // There is no scheduled compute jobs waiting.
    if (dependsComputeJobs.length === 0) {
      this.startingDate = null;

      await saleInvoicesCost.scheduleWriteJournalEntries(
        tenantId,
        startingDate
      );
    }
  }
}
