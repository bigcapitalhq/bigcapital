import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Webhook } from '../models/Webhook.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditWebhookDto } from '../dtos/Webhook.dto';

@Injectable()
export class EditWebhookService {
  constructor(
    @Inject(Webhook.name)
    private readonly webhookModel: TenantModelProxy<typeof Webhook>,
  ) {}

  public async editWebhook(webhookId: number, dto: EditWebhookDto) {
    const webhook = await this.webhookModel().query().findById(webhookId);
    if (!webhook) {
      throw new NotFoundException('Webhook not found.');
    }
    const updated = await this.webhookModel()
      .query()
      .patchAndFetchById(webhookId, { ...dto } as any);
    return updated;
  }
}
