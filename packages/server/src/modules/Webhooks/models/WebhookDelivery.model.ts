import { BaseModel } from '@/models/Model';

export class WebhookDelivery extends BaseModel {
  id!: number;
  webhookId!: number;
  eventType!: string;
  payload!: Record<string, any>;
  responseStatus?: number;
  responseBody?: string;
  attemptCount!: number;
  errorMessage?: string;
  deliveredAt?: Date;
  createdAt!: Date;

  static get tableName() {
    return 'webhook_deliveries';
  }

  get timestamps() {
    return ['createdAt'];
  }

  static get jsonAttributes() {
    return ['payload'];
  }
}
