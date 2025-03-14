import { EventEmitter2 } from '@nestjs/event-emitter';
import { JOB_REF, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import { ClsService } from 'nestjs-cls';
import { TenantJobPayload } from '@/interfaces/Tenant';
import { InventoryComputeCostService } from '../commands/InventoryComputeCost.service';
import { events } from '@/common/events/events';
import {
  ComputeItemCostQueue,
  ComputeItemCostQueueJob,
} from '../types/InventoryCost.types';
import { Process } from '@nestjs/bull';

interface ComputeItemCostJobPayload extends TenantJobPayload {
  itemId: number;
  startingDate: Date;
}
@Processor({
  name: ComputeItemCostQueue,
  scope: Scope.REQUEST,
})
export class ComputeItemCostProcessor extends WorkerHost {
  /**
   * @param {InventoryComputeCostService} inventoryComputeCostService -
   * @param {ClsService} clsService -
   * @param {EventEmitter2} eventEmitter -
   */
  constructor(
    private readonly inventoryComputeCostService: InventoryComputeCostService,
    private readonly clsService: ClsService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  /**
   * Process the compute item cost job.
   * @param {Job<ComputeItemCostJobPayload>} job - The job to process
   */
  @Process(ComputeItemCostQueueJob)
  async process(job: Job<ComputeItemCostJobPayload>) {
    const { itemId, startingDate, organizationId, userId } = job.data;

    console.log(`Compute item cost for item ${itemId} started`);

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    try {
      await this.inventoryComputeCostService.computeItemCost(
        startingDate,
        itemId,
      );
      // Emit job completed event
      await this.eventEmitter.emitAsync(
        events.inventory.onComputeItemCostJobCompleted,
        { startingDate, itemId, organizationId, userId },
      );

      console.log(`Compute item cost for item ${itemId} completed`);
    } catch (error) {
      console.error('Error computing item cost:', error);
      throw error;
    }
  }
}
