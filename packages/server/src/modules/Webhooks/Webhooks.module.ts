import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { WebhooksController } from './Webhooks.controller';
import { WebhooksApplication } from './Webhooks.application';
import { CreateWebhookService } from './commands/CreateWebhook.service';
import { EditWebhookService } from './commands/EditWebhook.service';
import { DeleteWebhookService } from './commands/DeleteWebhook.service';
import { ToggleWebhookActiveService } from './commands/ToggleWebhookActive.service';
import { GetWebhookService } from './queries/GetWebhook.service';
import { GetWebhooksService } from './queries/GetWebhooks.service';
import { GetWebhookDeliveriesService } from './queries/GetWebhookDeliveries.service';
import { WebhookSignatureService } from './WebhookSignature.service';
import { WebhookDelivererService } from './WebhookDeliverer.service';
import { WebhookDeliveryProcessor } from './processors/WebhookDelivery.processor';
import { WebhooksEventSubscriber } from './subscribers/WebhooksEventSubscriber';
import { Webhook } from './models/Webhook.model';
import { WebhookDelivery } from './models/WebhookDelivery.model';
import { WebhookDeliveryQueue } from './constants';

const models = [
  RegisterTenancyModel(Webhook),
  RegisterTenancyModel(WebhookDelivery),
];

@Module({
  imports: [
    ...models,
    BullModule.registerQueue({ name: WebhookDeliveryQueue }),
    BullBoardModule.forFeature({
      name: WebhookDeliveryQueue,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [WebhooksController],
  providers: [
    WebhooksApplication,
    CreateWebhookService,
    EditWebhookService,
    DeleteWebhookService,
    ToggleWebhookActiveService,
    GetWebhookService,
    GetWebhooksService,
    GetWebhookDeliveriesService,
    WebhookSignatureService,
    WebhookDelivererService,
    WebhookDeliveryProcessor,
    WebhooksEventSubscriber,
  ],
  exports: [...models, WebhookDelivererService],
})
export class WebhooksModule {}
