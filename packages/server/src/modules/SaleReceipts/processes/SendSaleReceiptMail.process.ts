import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendSaleReceiptMailQueue } from '../constants';
import { SaleReceiptMailNotification } from '../commands/SaleReceiptMailNotification';
import { SaleReceiptSendMailPayload } from '../types/SaleReceipts.types';
import { ClsService } from 'nestjs-cls';

@Processor(SendSaleReceiptMailQueue)
export class SendSaleReceiptMailProcess {
  constructor(
    private readonly saleReceiptMailNotification: SaleReceiptMailNotification,
    private readonly clsService: ClsService,
  ) {}

  @Process(SendSaleReceiptMailQueue)
  async handleSendMailJob(job: Job<SaleReceiptSendMailPayload>) {
    const { messageOpts, saleReceiptId, organizationId, userId } = job.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    await this.saleReceiptMailNotification.sendMail(saleReceiptId, messageOpts);
  }
}
