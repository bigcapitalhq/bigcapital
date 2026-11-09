import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import { ClsService, UseCls } from 'nestjs-cls';
import { ItemReorderPointNotificationQueue } from '../ItemReorderPoints.constants';
import { IItemReorderPointNotificationJobPayload } from '../ItemReorderPoints.types';
import { ItemReorderPointNotificationService } from '../commands/ItemReorderPointNotification.service';

@Processor({
  name: ItemReorderPointNotificationQueue,
  scope: Scope.REQUEST,
})
export class ItemReorderPointNotificationProcessor extends WorkerHost {
  constructor(
    private readonly itemReorderPointNotification: ItemReorderPointNotificationService,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job<IItemReorderPointNotificationJobPayload>) {
    const { itemIds, organizationId, userId } = job.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    await this.itemReorderPointNotification.processItems(itemIds);
  }
}
