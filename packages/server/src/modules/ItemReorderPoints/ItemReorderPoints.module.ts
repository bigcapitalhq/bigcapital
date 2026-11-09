import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailModule } from '../Mail/Mail.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { ItemReorderPointNotificationQueue } from './ItemReorderPoints.constants';
import { ItemReorderPointNotificationService } from './commands/ItemReorderPointNotification.service';
import { ItemReorderPointNotificationProcessor } from './processors/ItemReorderPointNotification.processor';
import { ItemReorderPointNotificationSubscriber } from './subscribers/ItemReorderPointNotification.subscriber';

@Module({
  imports: [
    TenancyModule,
    MailModule,
    BullModule.registerQueue({ name: ItemReorderPointNotificationQueue }),
    BullBoardModule.forFeature({
      name: ItemReorderPointNotificationQueue,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [
    ItemReorderPointNotificationService,
    ItemReorderPointNotificationProcessor,
    ItemReorderPointNotificationSubscriber,
  ],
})
export class ItemReorderPointsModule {}
