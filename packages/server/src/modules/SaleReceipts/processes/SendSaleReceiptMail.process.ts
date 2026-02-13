import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Scope } from '@nestjs/common';
import { SendSaleReceiptMailQueue, SendSaleReceiptMailJob } from '../constants';
import { SaleReceiptMailNotification } from '../commands/SaleReceiptMailNotification';
import { ClsService, UseCls } from 'nestjs-cls';

@Processor({
  name: SendSaleReceiptMailQueue,
  scope: Scope.REQUEST,
})
export class SendSaleReceiptMailProcess extends WorkerHost {
  constructor(
    private readonly saleReceiptMailNotification: SaleReceiptMailNotification,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job) {
    const { messageOpts, saleReceiptId, organizationId, userId } =
      job.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    try {
      await this.saleReceiptMailNotification.sendMail(
        saleReceiptId,
        messageOpts,
      );
    } catch (error) {
      console.error('Failed to process receipt mail job:', error);
      throw error;
    }
  }
}
