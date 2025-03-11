import { JOB_REF, Processor } from '@nestjs/bullmq';
import { Inject, Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import { ClsService } from 'nestjs-cls';
import { TenantJobPayload } from '@/interfaces/Tenant';
import { InventoryComputeCostService } from '../commands/InventoryComputeCost.service';

interface ComputeItemCostJobPayload extends TenantJobPayload {
  itemId: number;
  startingDate: Date;
}

@Processor({
  name: 'compute-item-cost',
  scope: Scope.REQUEST,
})
export class ComputeItemCostProcessor {
  constructor(
    private readonly inventoryComputeCostService: InventoryComputeCostService,
    private readonly clsService: ClsService,

    @Inject(JOB_REF)
    private readonly jobRef: Job<ComputeItemCostJobPayload>,
  ) {}

  /**
   * Handle compute item cost job.
   */
  async handleComputeItemCost() {
    const { itemId, startingDate, organizationId, userId } = this.jobRef.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    await this.inventoryComputeCostService.computeItemCost(
      startingDate,
      itemId,
    );
  }
}
