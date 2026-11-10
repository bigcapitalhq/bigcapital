import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Webhook } from '../models/Webhook.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetWebhookService {
  constructor(
    @Inject(Webhook.name)
    private readonly webhookModel: TenantModelProxy<typeof Webhook>,
  ) {}

  public async getWebhook(webhookId: number) {
    const webhook = await this.webhookModel().query().findById(webhookId);
    if (!webhook) {
      throw new NotFoundException('Webhook not found.');
    }
    return webhook;
  }
}
