import { Container } from 'typedi';
import moment from 'moment';
import InventoryService from '@/services/Inventory/Inventory';
import SalesInvoicesCost from '@/services/Sales/SalesInvoicesCost';

export default class ComputeItemCostJob {
  depends: number;
  agenda: any;
  startingDate: Date;
  
  constructor(agenda) {
    this.agenda = agenda;
    this.depends = 0;
    this.startingDate = null;

    this.agenda.on('complete:compute-item-cost', this.onJobFinished.bind(this));
    this.agenda.on('start:compute-item-cost', this.onJobStart.bind(this));
  }

  /**
   * The job handler.
   * @param {} -
   */
  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const { startingDate, itemId, costMethod = 'FIFO' } = job.attrs.data;

    Logger.debug(`Compute item cost - started: ${job.attrs.data}`);

    try {
      await InventoryService.computeItemCost(startingDate, itemId, costMethod);  
      Logger.debug(`Compute item cost - completed: ${job.attrs.data}`);
      done();
    } catch(e) {
      console.log(e);
      Logger.error(`Compute item cost: ${job.attrs.data}, error: ${e}`);
      done(e);  
    }
  }

  /**
   * Handle the job started.
   * @param {Job} job - .
   */
  async onJobStart(job) {
    const { startingDate } = job.attrs.data;
    this.depends += 1;

    if (!this.startingDate || moment(this.startingDate).isBefore(startingDate)) {
      this.startingDate = startingDate;
    }
  }

  /**
   * Handle job complete items cost finished.
   * @param {Job} job - 
   */
  async onJobFinished() {
    const agenda = Container.get('agenda');
    const startingDate = this.startingDate;
    this.depends = Math.max(this.depends - 1, 0);

    console.log(startingDate);

    if (this.depends === 0) {
      this.startingDate = null;

      await agenda.now('rewrite-invoices-journal-entries', {
        startingDate,
      });
    }
  }
}
