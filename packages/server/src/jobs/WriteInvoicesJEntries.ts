import { Container } from 'typedi';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { SaleInvoicesCost } from '@/services/Sales/Invoices/SalesInvoicesCost';

export default class WriteInvoicesJournalEntries {
  eventPublisher: EventPublisher;

  /**
   * Constructor method.
   */
  constructor(agenda) {
    const eventName = 'rewrite-invoices-journal-entries';
    this.eventPublisher = Container.get(EventPublisher);

    agenda.define(
      eventName,
      { priority: 'normal', concurrency: 20 },
      this.handler.bind(this)
    );
    agenda.on(`complete:${eventName}`, this.onJobCompleted.bind(this));
  }

  /**
   * Handle the job execuation.
   */
  public async handler(job, done: Function): Promise<void> {
    const { startingDate, tenantId } = job.attrs.data;
    const salesInvoicesCost = Container.get(SaleInvoicesCost);

    try {
      await salesInvoicesCost.writeCostLotsGLEntries(tenantId, startingDate);
      done();
    } catch (e) {
      done(e);
    }
  }

  /**
   * Handle the job complete.
   */
  async onJobCompleted(job) {
    const { startingDate, itemId, tenantId } = job.attrs.data;

    await this.eventPublisher.emitAsync(
      events.inventory.onInventoryCostEntriesWritten,
      { startingDate, itemId, tenantId }
    );
  }
}
