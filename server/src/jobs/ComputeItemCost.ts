import { Container } from 'typedi';
import {EventDispatcher} from "event-dispatch";
import events from 'subscribers/events';
import InventoryService from 'services/Inventory/Inventory';

export default class ComputeItemCostJob {
  agenda: any;
  eventDispatcher: EventDispatcher;
  
  /**
   * Constructor method.
   * @param agenda 
   */
  constructor(agenda) {
    this.agenda = agenda;
    this.eventDispatcher = new EventDispatcher();

    agenda.define(
      'compute-item-cost',
      { priority: 'high', concurrency: 1 },
      this.handler.bind(this),
    );
    this.agenda.on('start:compute-item-cost', this.onJobStart.bind(this));
    this.agenda.on('complete:compute-item-cost', this.onJobCompleted.bind(this));
  }

  /**
   * The job handler.
   */
  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const inventoryService = Container.get(InventoryService);

    const { startingDate, itemId, tenantId } = job.attrs.data;

    Logger.info(`Compute item cost - started: ${job.attrs.data}`);

    try {
      await inventoryService.computeItemCost(tenantId, startingDate, itemId);
      Logger.info(`Compute item cost - completed: ${job.attrs.data}`);
      done();
    } catch(e) {
      Logger.info(`Compute item cost: ${job.attrs.data}, error: ${e}`);
      done(e);  
    }
  }

  /**
   * Handle the job started.
   */
  async onJobStart(job) {
    const { startingDate, itemId, tenantId } = job.attrs.data;

    await this.eventDispatcher.dispatch(
      events.inventory.onComputeItemCostJobStarted,
      { startingDate, itemId, tenantId }
    );
  }

  /**
   * Handle job complete items cost finished.
   * @param {Job} job - 
   */
  async onJobCompleted(job) {
    const { startingDate, itemId, tenantId } = job.attrs.data;

    await this.eventDispatcher.dispatch(
      events.inventory.onComputeItemCostJobCompleted,
      { startingDate, itemId, tenantId },
    );
  }
}
