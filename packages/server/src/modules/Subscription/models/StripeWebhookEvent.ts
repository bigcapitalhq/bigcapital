import { mixin } from 'objection';
import { SystemModel } from '@/modules/System/models/SystemModel';

export class StripeWebhookEvent extends mixin(SystemModel) {
  public readonly stripeEventId!: string;
  public readonly type!: string;
  public readonly payload!: string | Record<string, unknown>;
  public readonly processedAt!: Date;
  public readonly error!: string;

  /**
   * Table name.
   */
  static get tableName() {
    return 'stripe_webhook_events';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
