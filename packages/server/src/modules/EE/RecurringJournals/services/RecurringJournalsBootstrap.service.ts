import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RecurringJournalsQueue } from './RecurringJournalsQueue.service';

@Injectable()
export class RecurringJournalsBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(RecurringJournalsBootstrap.name);

  constructor(
    private readonly recurringJournalsQueue: RecurringJournalsQueue,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.recurringJournalsQueue.registerScan();
    } catch (error) {
      this.logger.error(
        'Failed to register recurring journals scan job',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
