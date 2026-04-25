import * as crypto from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SquareApiClient } from '../utils/SquareApiClient.service';
import { SquareConnection } from '../models/SquareConnection.model';

// Events the Phase 2/3 router will consume. Subscribing now (Phase 1) means
// the event log starts populating today; the router silently logs unknown
// types until handlers land. Square ignores unsupported names so this list
// is allowed to evolve without re-registration.
const WEBHOOK_EVENT_TYPES = [
  'payment.created',
  'payment.updated',
  'order.created',
  'order.updated',
  'order.fulfillment.updated',
  'invoice.created',
  'invoice.published',
  'invoice.payment_made',
  'invoice.canceled',
  'refund.created',
  'refund.updated',
  'payout.sent',
  'payout.paid',
  'payout.failed',
  'customer.created',
  'customer.updated',
];

const SQUARE_API_VERSION = '2024-10-17';

export interface RegisterWebhookResult {
  subscriptionId: string;
  signatureKey: string;
}

/**
 * Registers a per-seller webhook subscription with Square's webhook
 * subscriptions API using the seller's OAuth access token. The resulting
 * subscription only fires for that seller's events, which matches our
 * per-connection routing model (notification URL embeds the connectionId).
 *
 * Square owns and rotates the signature key — we replace the placeholder
 * key the OAuth-callback row inserted with the value Square returns here.
 *
 * Failures here MUST NOT break the OAuth flow. The caller is expected to
 * catch and surface the message via `connection.statusMessage`; the admin
 * can recover by pasting a key into the wizard's manual override field.
 */
@Injectable()
export class RegisterSquareWebhookSubscription {
  private readonly logger = new Logger(RegisterSquareWebhookSubscription.name);

  constructor(
    private readonly squareApi: SquareApiClient,
    private readonly config: ConfigService,
  ) {}

  public async register(
    connection: SquareConnection,
  ): Promise<RegisterWebhookResult> {
    const publicBase = (
      this.config.get<string>('BASE_URL') ?? ''
    ).replace(/\/$/, '');
    if (!publicBase) {
      throw new Error(
        'Cannot register Square webhook: BASE_URL is not configured.',
      );
    }
    const notificationUrl = `${publicBase}/api/integrations/square/webhooks/${connection.id}`;

    const res = await this.squareApi.request(connection, {
      method: 'POST',
      url: '/v2/webhooks/subscriptions',
      data: {
        idempotency_key: crypto.randomUUID(),
        subscription: {
          name: `Bigcapital · connection ${connection.id}`,
          enabled: true,
          event_types: WEBHOOK_EVENT_TYPES,
          notification_url: notificationUrl,
          api_version: SQUARE_API_VERSION,
        },
      },
    });

    if (res.status !== 200) {
      throw new Error(
        `Square webhook registration failed: ${res.status} ${JSON.stringify(
          res.data,
        )}`,
      );
    }
    const sub = res.data?.subscription;
    if (!sub?.id || !sub?.signature_key) {
      throw new Error(
        'Square webhook registration response missing id or signature_key.',
      );
    }
    return {
      subscriptionId: sub.id,
      signatureKey: sub.signature_key,
    };
  }
}
