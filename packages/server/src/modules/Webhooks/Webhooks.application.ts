import { Injectable } from '@nestjs/common';
import { CreateWebhookService } from './commands/CreateWebhook.service';
import { EditWebhookService } from './commands/EditWebhook.service';
import { DeleteWebhookService } from './commands/DeleteWebhook.service';
import { ToggleWebhookActiveService } from './commands/ToggleWebhookActive.service';
import { GetWebhookService } from './queries/GetWebhook.service';
import { GetWebhooksService } from './queries/GetWebhooks.service';
import { GetWebhookDeliveriesService } from './queries/GetWebhookDeliveries.service';
import { CreateWebhookDto, EditWebhookDto } from './dtos/Webhook.dto';

@Injectable()
export class WebhooksApplication {
  constructor(
    private readonly createWebhookService: CreateWebhookService,
    private readonly editWebhookService: EditWebhookService,
    private readonly deleteWebhookService: DeleteWebhookService,
    private readonly toggleWebhookActiveService: ToggleWebhookActiveService,
    private readonly getWebhookService: GetWebhookService,
    private readonly getWebhooksService: GetWebhooksService,
    private readonly getWebhookDeliveriesService: GetWebhookDeliveriesService,
  ) {}

  public createWebhook(dto: CreateWebhookDto) {
    return this.createWebhookService.createWebhook(dto);
  }

  public editWebhook(webhookId: number, dto: EditWebhookDto) {
    return this.editWebhookService.editWebhook(webhookId, dto);
  }

  public deleteWebhook(webhookId: number) {
    return this.deleteWebhookService.deleteWebhook(webhookId);
  }

  public toggleWebhookActive(webhookId: number) {
    return this.toggleWebhookActiveService.toggleWebhookActive(webhookId);
  }

  public getWebhook(webhookId: number) {
    return this.getWebhookService.getWebhook(webhookId);
  }

  public getWebhooks(filterBy?: string, page?: number, pageSize?: number) {
    return this.getWebhooksService.getWebhooks(filterBy, page, pageSize);
  }

  public getWebhookDeliveries(webhookId: number, page?: number, pageSize?: number) {
    return this.getWebhookDeliveriesService.getDeliveries(webhookId, page, pageSize);
  }
}
