import { EventEmitter2 } from '@nestjs/event-emitter';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import { ClsService, UseCls } from 'nestjs-cls';
import * as moment from 'moment';
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
  startingDate: Date | string;
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
  @UseCls()
  async process(job: Job<ComputeItemCostJobPayload>) {
    const { itemId, startingDate, organizationId, userId } = job.data;

    // Parse startingDate using moment to handle both Date and string formats
    const startingDateObj = moment(startingDate).toDate();

    console.log(`[info] Compute item cost for item ${itemId} started`, {
      payload: job.data,
      jobId: job.id
    });
    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    try {
      await this.inventoryComputeCostService.computeItemCost(
        startingDateObj,
        itemId,
      );
      // Emit job completed event
      await this.eventEmitter.emitAsync(
        events.inventory.onComputeItemCostJobCompleted,
        { startingDate: startingDateObj, itemId, organizationId, userId },
      );
      console.log(`[info] Compute item cost for item ${itemId} completed successfully`);
    } catch (error) {
      console.error(`[error] Error computing item cost for item ${itemId}:`, error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }
}
