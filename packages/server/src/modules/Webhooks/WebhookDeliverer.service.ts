import { Injectable, Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Webhook } from './models/Webhook.model';
import { WebhookDelivery } from './models/WebhookDelivery.model';

import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { WebhookDeliveryQueue, WebhookDeliveryJob } from './constants';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class WebhookDelivererService {
  constructor(
    @InjectQueue(WebhookDeliveryQueue)
    private readonly webhookDeliveryQueue: Queue,
    @Inject(Webhook.name)
    private readonly webhookModel: TenantModelProxy<typeof Webhook>,
    @Inject(WebhookDelivery.name)
    private readonly webhookDeliveryModel: TenantModelProxy<typeof WebhookDelivery>,
    private readonly clsService: ClsService,
  ) {}

  /**
   * Finds active webhooks matching the entity and action, then enqueues delivery jobs.
   */
  public async enqueueMatchingWebhooks(
    entity: string,
    action: string,
    data: Record<string, any>,
  ): Promise<void> {
    const webhooks = await this.webhookModel()
      .query()
      .where('entity', entity)
      .where('is_active', true);

    const matchingWebhooks = webhooks.filter((webhook) => {
      return webhook.events.includes(action);
    });

    if (matchingWebhooks.length === 0) {
      return;
    }

    const eventType = `${entity}.${action}`;
    const payload = { event: eventType, data };
    const organizationId = this.clsService.get('organizationId');
    const userId = this.clsService.get('userId');

    for (const webhook of matchingWebhooks) {
      const delivery = await this.webhookDeliveryModel()
        .query()
        .insert({
          webhookId: webhook.id,
          eventType,
          payload,
          attemptCount: 0,
        });

      await this.webhookDeliveryQueue.add(WebhookDeliveryJob, {
        webhookId: webhook.id,
        eventType,
        payload,
        organizationId,
        userId,
        deliveryId: delivery.id,
      });
    }
  }
}
