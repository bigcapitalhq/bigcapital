import { Injectable, Inject } from '@nestjs/common';
import { WebhookDelivery } from '../models/WebhookDelivery.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetWebhookDeliveriesService {
  constructor(
    @Inject(WebhookDelivery.name)
    private readonly webhookDeliveryModel: TenantModelProxy<typeof WebhookDelivery>,
  ) {}

  public async getDeliveries(webhookId: number, page: number = 1, pageSize: number = 20) {
    const results = await this.webhookDeliveryModel()
      .query()
      .where('webhook_id', webhookId)
      .orderBy('createdAt', 'desc')
      .page(page - 1, pageSize);

    return {
      data: results.results,
      pagination: {
        total: results.total,
        page,
        pageSize,
      },
    };
  }
}
