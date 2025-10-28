import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  SendSaleEstimateMailJob,
  SendSaleEstimateMailQueue,
} from '../types/SaleEstimates.types';
import { SendSaleEstimateMail } from '../commands/SendSaleEstimateMail';

@Processor(SendSaleEstimateMailQueue)
export class SendSaleEstimateMailProcess {
  constructor(private readonly sendEstimateMailService: SendSaleEstimateMail) {}

  @Process(SendSaleEstimateMailJob)
  async handleSendMail(job: Job) {
    const { saleEstimateId, messageOptions } = job.data;

    await this.sendEstimateMailService.sendMail(saleEstimateId, messageOptions);
  }
}
