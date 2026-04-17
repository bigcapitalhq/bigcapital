import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Scope, Inject } from '@nestjs/common';
import { ClsService, UseCls } from 'nestjs-cls';
import axios, { AxiosError } from 'axios';
import { WebhookDeliveryQueue, WebhookDeliveryJob } from '../constants';
import { WebhookDeliveryQueueJobPayload } from '../Webhooks.types';
import { WebhookSignatureService } from '../WebhookSignature.service';
import { Webhook } from '../models/Webhook.model';
import { WebhookDelivery } from '../models/WebhookDelivery.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Processor({
  name: WebhookDeliveryQueue,
  scope: Scope.REQUEST,
})
export class WebhookDeliveryProcessor extends WorkerHost {
  constructor(
    private readonly webhookSignatureService: WebhookSignatureService,
    @Inject(Webhook.name)
    private readonly webhookModel: TenantModelProxy<typeof Webhook>,
    @Inject(WebhookDelivery.name)
    private readonly webhookDeliveryModel: TenantModelProxy<typeof WebhookDelivery>,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job<WebhookDeliveryQueueJobPayload>) {
    const { webhookId, payload, organizationId, deliveryId } = job.data;

    this.clsService.set('organizationId', organizationId);

    const webhook = await this.webhookModel().query().findById(webhookId);
    if (!webhook || !webhook.isActive) {
      return;
    }

    const body = JSON.stringify(payload);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (webhook.secret) {
      headers['X-Webhook-Signature'] = this.webhookSignatureService.generateSignature(body, webhook.secret);
    }

    if (webhook.headers) {
      for (const h of webhook.headers) {
        headers[h.param_name] = h.param_value;
      }
    }

    let responseStatus: number | null = null;
    let responseBody: string | null = null;
    let errorMessage: string | null = null;
    let deliveredAt: Date | null = null;

    try {
      const response = await axios.request({
        url: webhook.url,
        method: webhook.method,
        headers,
        data: body,
        timeout: 30000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      responseStatus = response.status;
      responseBody = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      deliveredAt = new Date();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        responseStatus = axiosError.response.status;
        responseBody = typeof axiosError.response.data === 'string' ? axiosError.response.data : JSON.stringify(axiosError.response.data);
      }
      errorMessage = axiosError.message;
      throw error;
    } finally {
      await this.webhookDeliveryModel()
        .query()
        .findById(deliveryId)
        .patch({
          responseStatus,
          responseBody,
          attemptCount: job.attemptsMade + 1,
          errorMessage,
          deliveredAt,
        });
    }
  }
}
