import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SmsService } from './SmsService';
import { SmsProcessor } from './SMS.processor';
import { SmsIntegrationSettingsService } from './SmsIntegrationSettings.service';
import { SMS_QUEUE } from './SMS.constants';

@Module({
  imports: [BullModule.registerQueue({ name: SMS_QUEUE })],
  providers: [SmsService, SmsProcessor, SmsIntegrationSettingsService],
  exports: [SmsService, SmsIntegrationSettingsService],
})
export class SMSModule {}
