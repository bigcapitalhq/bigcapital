import { Container } from 'typedi';
import SalesInvoicesCost from 'services/Sales/SalesInvoicesCost';

export default class WriteInvoicesJournalEntries {
  constructor(agenda) {
    agenda.define(
      'rewrite-invoices-journal-entries',
      { priority: 'normal', concurrency: 1 },
      this.handler.bind(this)
    );
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
}
