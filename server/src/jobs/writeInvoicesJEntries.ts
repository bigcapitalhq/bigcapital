import { Container } from 'typedi';
import {EventDispatcher} from "event-dispatch";
import events from 'subscribers/events';
import SalesInvoicesCost from 'services/Sales/SalesInvoicesCost';

export default class WriteInvoicesJournalEntries {
  eventDispatcher: EventDispatcher;

  /**
   * Constructor method.
   */
  constructor(agenda) {
    const eventName = 'rewrite-invoices-journal-entries';
    this.eventDispatcher = new EventDispatcher();

    agenda.define(
      eventName,
      { priority: 'normal', concurrency: 1 },
      this.handler.bind(this)
    );
    agenda.on(`complete:${eventName}`, this.onJobCompleted.bind(this));
  }

  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const { startingDate, tenantId } = job.attrs.data;

    const salesInvoicesCost = Container.get(SalesInvoicesCost);

    Logger.info(
      `Write sales invoices journal entries - started: ${job.attrs.data}`
    );
    try {
      await salesInvoicesCost.writeInventoryCostJournalEntries(
        tenantId,
        startingDate,
        true
      );
      Logger.info(
        `Write sales invoices journal entries - completed: ${job.attrs.data}`
      );
      done();
    } catch (e) {
      Logger.info(
        `Write sales invoices journal entries: ${job.attrs.data}, error: ${e}`
      );
      done(e);
    }
  }

  /**
   * Handle the job complete.
   */
   async onJobCompleted(job) {
    const { startingDate, itemId, tenantId } = job.attrs.data;

    await this.eventDispatcher.dispatch(
      events.inventory.onInventoryCostEntriesWritten,
      { startingDate, itemId, tenantId }
    );
  }
}
