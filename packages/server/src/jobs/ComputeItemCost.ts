import { Container } from 'typedi';
import events from '@/subscribers/events';
import InventoryService from '@/services/Inventory/Inventory';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import {
  IComputeItemCostJobCompletedPayload,
  IComputeItemCostJobStartedPayload,
} from '@/interfaces';

export default class ComputeItemCostJob {
  agenda: any;
  eventPublisher: EventPublisher;

  /**
   * Constructor method.
   * @param agenda
   */
  constructor(agenda) {
    this.agenda = agenda;
    this.eventPublisher = Container.get(EventPublisher);

    agenda.define(
      'compute-item-cost',
      { priority: 'high', concurrency: 20 },
      this.handler.bind(this)
    );
    this.agenda.on('start:compute-item-cost', this.onJobStart.bind(this));
    this.agenda.on(
      'complete:compute-item-cost',
      this.onJobCompleted.bind(this)
    );
  }

  /**
   * The job handler.
   */
  public async handler(job, done: Function): Promise<void> {
    const { startingDate, itemId, tenantId } = job.attrs.data;
    const inventoryService = Container.get(InventoryService);

    try {
      await inventoryService.computeItemCost(tenantId, startingDate, itemId);
      done();
    } catch (e) {
      done(e);
    }
  }

  /**
   * Handle the job started.
   */
  async onJobStart(job) {
    const { startingDate, itemId, tenantId } = job.attrs.data;

    await this.eventPublisher.emitAsync(
      events.inventory.onComputeItemCostJobStarted,
      { startingDate, itemId, tenantId } as IComputeItemCostJobStartedPayload
    );
  }

  /**
   * Handle job complete items cost finished.
   * @param {Job} job -
   */
  async onJobCompleted(job) {
    const { startingDate, itemId, tenantId } = job.attrs.data;

    await this.eventPublisher.emitAsync(
      events.inventory.onComputeItemCostJobCompleted,
      { startingDate, itemId, tenantId } as IComputeItemCostJobCompletedPayload
    );
  }
}
