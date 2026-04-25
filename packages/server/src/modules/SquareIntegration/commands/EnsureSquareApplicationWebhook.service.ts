import * as crypto from 'crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SquareApiClient } from '../utils/SquareApiClient.service';
import { TokenEncryption } from '../utils/TokenEncryption.service';
import { SquareApplicationWebhook } from '../models/SquareApplicationWebhook.model';

const SQUARE_API_VERSION = '2024-10-17';

// Subscribe to the events Phase 2/3 handlers will consume. Square ignores
// unknown event types, so this list is allowed to grow without forcing a
// re-registration.
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

export interface EnsureWebhookResult {
  subscriptionId: string;
  signatureKey: string;
  notificationUrl: string;
  alreadyRegistered: boolean;
}

/**
 * Idempotently ensures that an app-level Square webhook subscription
 * exists for the configured environment. Squares Subscriptions API is
 * authenticated by the applications PAT (SQUARE_APPLICATION_ACCESS_TOKEN),
 * which means subscriptions are app-scoped — a single subscription
 * receives events for every seller connected to this app.
 *
 * Stores subscription_id + AES-256-GCM-encrypted signature_key in the
 * system DB (square_application_webhooks, one row per environment). The
 * signature key is what the webhook receiver uses to verify HMAC.
 *
 * Safe to call repeatedly. Successful runs after the first are no-ops.
 */
@Injectable()
export class EnsureSquareApplicationWebhook {
  private readonly logger = new Logger(EnsureSquareApplicationWebhook.name);

  constructor(
    private readonly config: ConfigService,
    private readonly squareApi: SquareApiClient,
    private readonly tokenEncryption: TokenEncryption,
    @Inject(SquareApplicationWebhook.name)
    private readonly appWebhookModel: typeof SquareApplicationWebhook,
  ) {}

  public async ensure(environment: string): Promise<EnsureWebhookResult> {
    const publicBase = (
      this.config.get<string>('BASE_URL') ?? ''
    ).replace(/\/$/, '');
    if (!publicBase) {
      throw new Error(
        'Cannot register Square webhook: BASE_URL is not configured.',
      );
    }
    const notificationUrl = `${publicBase}/api/integrations/square/webhooks`;

    const existing = await this.appWebhookModel
      .query()
      .findOne({ environment });

    if (existing?.squareSubscriptionId && existing?.signatureKeyEncrypted) {
      return {
        subscriptionId: existing.squareSubscriptionId,
        signatureKey: this.tokenEncryption.decrypt(
          existing.signatureKeyEncrypted,
        ),
        notificationUrl: existing.notificationUrl ?? notificationUrl,
        alreadyRegistered: true,
      };
    }

    // Create a new subscription via Squares Subscriptions API using the
    // applications PAT (SquareApiClient.requestWithApplicationToken).
    const res = await this.squareApi.requestWithApplicationToken(environment, {
      method: 'POST',
      url: '/v2/webhooks/subscriptions',
      data: {
        idempotency_key: crypto.randomUUID(),
        subscription: {
          name: `Bigcapital · ${environment}`,
          enabled: true,
          event_types: WEBHOOK_EVENT_TYPES,
          notification_url: notificationUrl,
          api_version: SQUARE_API_VERSION,
        },
      },
    });
    if (res.status !== 200) {
      const errMsg = `Square webhook registration failed: ${
        res.status
      } ${JSON.stringify(res.data)}`;
      // Persist the error so admins can see it without spelunking logs.
      await this.upsertRow(environment, {
        notificationUrl,
        lastError: errMsg,
      });
      throw new Error(errMsg);
    }
    const sub = res.data?.subscription;
    if (!sub?.id || !sub?.signature_key) {
      throw new Error(
        'Square webhook registration response missing id or signature_key.',
      );
    }
    const signatureKeyEncrypted = this.tokenEncryption.encrypt(
      sub.signature_key,
    );
    await this.upsertRow(environment, {
      squareSubscriptionId: sub.id,
      signatureKeyEncrypted,
      notificationUrl,
      eventTypes: JSON.stringify(WEBHOOK_EVENT_TYPES),
      registeredAt: new Date(),
      lastError: null,
    });

    this.logger.log(
      `Registered app-level Square webhook for env=${environment} subscription_id=${sub.id}`,
    );
    return {
      subscriptionId: sub.id,
      signatureKey: sub.signature_key,
      notificationUrl,
      alreadyRegistered: false,
    };
  }

  /**
   * Look up the (decrypted) app-level signature key for an environment.
   * Returns null if no subscription has been registered yet — the
   * webhook receiver should reject the inbound request in that case.
   */
  public async getSignatureKey(environment: string): Promise<string | null> {
    const row = await this.appWebhookModel
      .query()
      .findOne({ environment });
    if (!row?.signatureKeyEncrypted) return null;
    return this.tokenEncryption.decrypt(row.signatureKeyEncrypted);
  }

  private async upsertRow(
    environment: string,
    patch: Partial<SquareApplicationWebhook>,
  ): Promise<void> {
    const existing = await this.appWebhookModel
      .query()
      .findOne({ environment });
    if (existing) {
      await this.appWebhookModel
        .query()
        .patchAndFetchById(existing.id, patch as any);
    } else {
      await this.appWebhookModel
        .query()
        .insert({ environment, ...patch } as any);
    }
  }
}
