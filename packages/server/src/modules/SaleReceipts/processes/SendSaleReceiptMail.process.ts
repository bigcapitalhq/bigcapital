import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Scope } from '@nestjs/common';
import { JOB_REF } from '@nestjs/bull';
import { SendSaleReceiptMailQueue, SendSaleReceiptMailJob } from '../constants';
import { SaleReceiptMailNotification } from '../commands/SaleReceiptMailNotification';
import { SaleReceiptSendMailPayload } from '../types/SaleReceipts.types';
import { ClsService, UseCls } from 'nestjs-cls';

@Processor({
  name: SendSaleReceiptMailQueue,
  scope: Scope.REQUEST,
})
export class SendSaleReceiptMailProcess {
  constructor(
    private readonly saleReceiptMailNotification: SaleReceiptMailNotification,
    private readonly clsService: ClsService,

    @Inject(JOB_REF)
    private readonly jobRef: Job<SaleReceiptSendMailPayload>,
  ) { }

  @Process(SendSaleReceiptMailJob)
  @UseCls()
  async handleSendMailJob() {
    const { messageOpts, saleReceiptId, organizationId, userId } =
      this.jobRef.data;

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
