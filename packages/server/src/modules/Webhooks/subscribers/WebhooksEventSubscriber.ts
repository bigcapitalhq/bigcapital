import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebhookDelivererService } from '../WebhookDeliverer.service';
import { WEBHOOK_EVENT_MAPPINGS } from '../WebhookEvents.registry';

@Injectable()
export class WebhooksEventSubscriber implements OnModuleInit {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly webhookDeliverer: WebhookDelivererService,
  ) {}

  onModuleInit() {
    for (const mapping of WEBHOOK_EVENT_MAPPINGS) {
      this.eventEmitter.on(mapping.internalEvent, async (payload: any) => {
        const data = payload?.[mapping.dataKey] ?? { id: payload?.[mapping.idKey] };
        await this.webhookDeliverer.enqueueMatchingWebhooks(
          mapping.entity,
          mapping.action,
          data,
        );
      });
    }
  }
}
