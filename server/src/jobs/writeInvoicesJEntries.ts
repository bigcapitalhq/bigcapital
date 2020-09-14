import { Container } from 'typedi';
import SalesInvoicesCost from 'services/Sales/SalesInvoicesCost';

export default class WriteInvoicesJournalEntries {

  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const { startingDate } = job.attrs.data;

    Logger.info(`Write sales invoices journal entries - started: ${job.attrs.data}`);
  
    try {
      await SalesInvoicesCost.writeJournalEntries(startingDate, true);
      Logger.info(`Write sales invoices journal entries - completed: ${job.attrs.data}`);
      done();
    } catch(e) {
      console.log(e);
      Logger.info(`Write sales invoices journal entries: ${job.attrs.data}, error: ${e}`);
      done(e); 
    }
  }
}