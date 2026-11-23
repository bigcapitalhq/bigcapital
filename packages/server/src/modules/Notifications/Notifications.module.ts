import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { SocketModule } from '../Socket/Socket.module';
import { Notification } from './models/Notification.model';
import { NotificationsController } from './Notifications.controller';
import { GetNotificationsService } from './queries/GetNotifications.service';
import { CreateNotificationService } from './commands/CreateNotification.service';
import { InventoryCostNotificationsSubscriber } from './subscribers/InventoryCostNotifications.subscriber';

const models = [RegisterTenancyModel(Notification)];

@Module({
  imports: [TenancyDatabaseModule, SocketModule, ...models],
  controllers: [NotificationsController],
  providers: [
    GetNotificationsService,
    CreateNotificationService,
    InventoryCostNotificationsSubscriber,
    TenancyContext,
  ],
  exports: [GetNotificationsService, CreateNotificationService, ...models],
})
export class NotificationsModule {}
