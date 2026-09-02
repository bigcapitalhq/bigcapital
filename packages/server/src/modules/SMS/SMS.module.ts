import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SmsService } from './SmsService';
import { SmsProcessor } from './SMS.processor';
import { SmsIntegrationSettingsService } from './SmsIntegrationSettings.service';
import { SMS_QUEUE } from './SMS.constants';
import { FeaturesModule } from '../Features/Features.module';
import { SmsNotificationsFeatureGuard } from './SmsNotificationsFeatureGuard';

@Module({
  imports: [BullModule.registerQueue({ name: SMS_QUEUE }), FeaturesModule],
  providers: [
    SmsService,
    SmsProcessor,
    SmsIntegrationSettingsService,
    SmsNotificationsFeatureGuard,
  ],
  exports: [
    SmsService,
    SmsIntegrationSettingsService,
    SmsNotificationsFeatureGuard,
  ],
})
export class SMSModule {}
