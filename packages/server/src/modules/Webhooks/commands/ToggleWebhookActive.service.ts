import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Webhook } from '../models/Webhook.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class ToggleWebhookActiveService {
  constructor(
    @Inject(Webhook.name)
    private readonly webhookModel: TenantModelProxy<typeof Webhook>,
  ) {}

  public async toggleWebhookActive(webhookId: number) {
    const webhook = await this.webhookModel().query().findById(webhookId);
    if (!webhook) {
      throw new NotFoundException('Webhook not found.');
    }
    const updated = await this.webhookModel()
      .query()
      .patchAndFetchById(webhookId, { isActive: !webhook.isActive } as any);
    return updated;
  }
}
