import { Injectable, Inject } from '@nestjs/common';
import { Webhook } from '../models/Webhook.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateWebhookDto } from '../dtos/Webhook.dto';

@Injectable()
export class CreateWebhookService {
  constructor(
    @Inject(Webhook.name)
    private readonly webhookModel: TenantModelProxy<typeof Webhook>,
  ) {}

  public async createWebhook(dto: CreateWebhookDto) {
    const webhook = await this.webhookModel().query().insertAndFetch({
      ...dto,
      method: dto.method || 'POST',
      isActive: true,
    } as any);
    return webhook;
  }
}
