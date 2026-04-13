import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { SocketModule } from '../Socket/Socket.module';
import { NotificationsController } from './Notifications.controller';
import { GetNotificationsService } from './queries/GetNotifications.service';
import { CreateNotificationService } from './commands/CreateNotification.service';
import { InventoryCostNotificationsSubscriber } from './subscribers/InventoryCostNotifications.subscriber';
import { OverdueSaleInvoiceNotificationsJob } from './jobs/OverdueSaleInvoiceNotifications.job';

@Module({
  imports: [TenancyDatabaseModule, SocketModule],
  controllers: [NotificationsController],
  providers: [
    GetNotificationsService,
    CreateNotificationService,
    InventoryCostNotificationsSubscriber,
    OverdueSaleInvoiceNotificationsJob,
    TenancyContext,
  ],
  exports: [GetNotificationsService, CreateNotificationService],
})
export class NotificationsModule {}
