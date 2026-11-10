import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { RecurringInvoicesQueue } from './RecurringInvoicesQueue.service';

@Injectable()
export class RecurringInvoicesBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(RecurringInvoicesBootstrap.name);

  constructor(
    private readonly recurringInvoicesQueue: RecurringInvoicesQueue,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.recurringInvoicesQueue.registerScan();
    } catch (error) {
      this.logger.error(
        'Failed to register recurring invoices scan job',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
