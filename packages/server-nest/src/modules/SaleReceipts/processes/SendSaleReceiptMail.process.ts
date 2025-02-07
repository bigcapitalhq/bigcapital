import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendSaleReceiptMailQueue } from '../constants';
import { SaleReceiptMailNotification } from '../commands/SaleReceiptMailNotification';

@Processor(SendSaleReceiptMailQueue)
export class SendSaleReceiptMailProcess {
  constructor(
    private readonly saleReceiptMailNotification: SaleReceiptMailNotification,
  ) {}

  @Process(SendSaleReceiptMailQueue)
  async handleSendMailJob(job: Job) {
    const { messageOpts, saleReceiptId } = job.data;

    await this.saleReceiptMailNotification.sendMail(saleReceiptId, messageOpts);
  }
}
