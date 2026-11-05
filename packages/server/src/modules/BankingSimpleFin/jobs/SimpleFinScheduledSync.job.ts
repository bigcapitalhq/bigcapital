import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SystemSimpleFinItem } from '../models/SystemSimpleFinItem';
import { SimpleFinSyncQueueService } from '../commands/SimpleFinSyncQueue.service';

@Injectable()
export class SimpleFinScheduledSyncJob {
  private readonly logger = new Logger(SimpleFinScheduledSyncJob.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly syncQueue: SimpleFinSyncQueueService,

    @Inject(SystemSimpleFinItem.name)
    private readonly systemSimpleFinItemModel: typeof SystemSimpleFinItem,
  ) {}

  /**
   * SimpleFIN has no webhooks, so every hour enqueue a sync for each known
   * item. The processor skips items that are paused or whose configured sync
   * interval has not elapsed yet.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async enqueueDueSyncs() {
    if (!this.configService.get('simplefin.enabled')) return;

    try {
      const items = await this.systemSimpleFinItemModel.query();

      await Promise.all(
        items.map((item) => this.syncQueue.enqueue(item.simplefinItemId)),
      );
      if (items.length > 0) {
        this.logger.log(`Enqueued ${items.length} SimpleFIN sync job(s).`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to enqueue SimpleFIN scheduled syncs: ${error?.message}`,
      );
    }
  }
}
