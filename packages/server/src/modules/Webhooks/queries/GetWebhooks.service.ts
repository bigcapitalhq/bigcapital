import { Injectable, Inject } from '@nestjs/common';
import { Webhook } from '../models/Webhook.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetWebhooksService {
  constructor(
    @Inject(Webhook.name)
    private readonly webhookModel: TenantModelProxy<typeof Webhook>,
  ) {}

  public async getWebhooks(filterBy?: string, page: number = 1, pageSize: number = 20) {
    let query = this.webhookModel().query().orderBy('createdAt', 'desc');

    if (filterBy && filterBy !== 'all') {
      query = query.where('entity', filterBy);
    }

    const results = await query.page(page - 1, pageSize);

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
