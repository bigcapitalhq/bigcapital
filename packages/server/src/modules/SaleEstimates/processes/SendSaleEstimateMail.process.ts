import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Scope } from '@nestjs/common';
import { JOB_REF } from '@nestjs/bull';
import {
  SendSaleEstimateMailJob,
  SendSaleEstimateMailQueue,
} from '../types/SaleEstimates.types';
import { SendSaleEstimateMail } from '../commands/SendSaleEstimateMail';
import { ClsService, UseCls } from 'nestjs-cls';

@Processor({
  name: SendSaleEstimateMailQueue,
  scope: Scope.REQUEST,
})
export class SendSaleEstimateMailProcess {
  constructor(
    private readonly sendEstimateMailService: SendSaleEstimateMail,
    private readonly clsService: ClsService,
    @Inject(JOB_REF)
    private readonly jobRef: Job,
  ) { }

  @Process(SendSaleEstimateMailJob)
  @UseCls()
  async handleSendMail() {
    const { saleEstimateId, messageOptions, organizationId, userId } = this.jobRef.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    try {
      await this.sendEstimateMailService.sendMail(saleEstimateId, messageOptions);
    } catch (error) {
      console.error('Failed to process estimate mail job:', error);
      throw error;
    }
  }
}
