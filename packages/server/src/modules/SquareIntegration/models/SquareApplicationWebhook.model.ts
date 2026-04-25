import { BaseModel } from '@/models/Model';

/**
 * App-level Square webhook subscription, one row per environment
 * (sandbox, production). Lives in the system DB because Square's
 * Subscriptions API uses the application PAT — subscriptions are
 * app-scoped, not tenant-scoped.
 */
export class SquareApplicationWebhook extends BaseModel {
  public id!: number;
  public environment!: string;
  public squareSubscriptionId!: string | null;
  public signatureKeyEncrypted!: string | null;
  public notificationUrl!: string | null;
  public eventTypes!: any;
  public registeredAt!: Date | null;
  public lastError!: string | null;

  static get tableName() {
    return 'square_application_webhooks';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
