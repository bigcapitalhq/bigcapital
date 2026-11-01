import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Scope } from '@nestjs/common';
import { ClsService, UseCls } from 'nestjs-cls';
import { SmsService } from './SmsService';
import { SMS_QUEUE } from './SMS.constants';
import { SmsJobPayload } from './SMS.types';

@Processor({
  name: SMS_QUEUE,
  scope: Scope.REQUEST,
})
export class SmsProcessor extends WorkerHost {
  constructor(
    private readonly smsService: SmsService,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job<SmsJobPayload>) {
    const { to, body, organizationId, userId } = job.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    try {
      await this.smsService.send(to, body);
    } catch (error) {
      console.error('Failed to process SMS job:', error);
      throw error;
    }
  }
}
