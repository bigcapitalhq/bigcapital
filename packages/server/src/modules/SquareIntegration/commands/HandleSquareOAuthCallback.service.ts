import * as crypto from 'crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';
import { SquareApiClient } from '../utils/SquareApiClient.service';
import { TokenEncryption } from '../utils/TokenEncryption.service';
import { RegisterSquareWebhookSubscription } from './RegisterSquareWebhookSubscription.service';

@Injectable()
export class HandleSquareOAuthCallback {
  private readonly logger = new Logger(HandleSquareOAuthCallback.name);

  constructor(
    private readonly config: ConfigService,
    private readonly squareApi: SquareApiClient,
    private readonly tokenEncryption: TokenEncryption,
    private readonly registerWebhook: RegisterSquareWebhookSubscription,

    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  /**
   * Exchange the OAuth code → tokens, upsert the connection row in `pending`
   * status (the wizard completes configuration before flipping to `active`).
   */
  public async handleCallback(code: string, environment?: string) {
    const env =
      environment ??
      this.config.get<string>('SQUARE_ENVIRONMENT') ??
      'production';

    const tokens = await this.squareApi.exchangeOAuthCode(code, env);

    const accessTokenEncrypted = this.tokenEncryption.encrypt(
      tokens.accessToken,
    );
    const refreshTokenEncrypted = this.tokenEncryption.encrypt(
      tokens.refreshToken,
    );

    // Upsert by (merchant_id, environment). Reconnecting replaces tokens
    // but preserves the user's prior wizard choices (accounts, mappings).
    const existing = await this.connectionModel()
      .query()
      .findOne({ merchantId: tokens.merchantId, environment: env });

    if (existing) {
      const refreshed = await this.connectionModel()
        .query()
        .patchAndFetchById(existing.id, {
          accessTokenEncrypted,
          refreshTokenEncrypted,
          tokenExpiresAt: tokens.expiresAt,
          status: existing.clearingAccountId ? 'active' : 'pending',
          statusMessage: null,
          connectedAt: new Date(),
          disconnectedAt: null,
        });
      // Register the webhook subscription only if it has never been
      // registered. Reconnects keep the existing subscription/key so we
      // don't accumulate stale subscriptions on Square's side.
      if (!refreshed.squareWebhookSubscriptionId) {
        await this.tryRegisterWebhook(refreshed);
      }
      return { connectionId: existing.id, isNew: false };
    }

    const created = await this.connectionModel()
      .query()
      .insert({
        merchantId: tokens.merchantId,
        environment: env,
        accessTokenEncrypted,
        refreshTokenEncrypted,
        tokenExpiresAt: tokens.expiresAt,
        // Placeholder; replaced with Square's signature_key once the
        // webhook subscription is registered immediately below.
        webhookSignatureKey: crypto.randomBytes(32).toString('hex'),
        status: 'pending',
        connectedAt: new Date(),
      });
    await this.tryRegisterWebhook(created);
    return { connectionId: created.id, isNew: true };
  }

  /**
   * Best-effort webhook subscription registration. Failures are persisted
   * to `statusMessage` so the admin sees them in the wizard, but never
   * propagate — OAuth completing successfully is more important than
   * webhook plumbing, and the manual override field provides a recovery
   * path.
   */
  private async tryRegisterWebhook(connection: SquareConnection): Promise<void> {
    try {
      const result = await this.registerWebhook.register(connection);
      await this.connectionModel()
        .query()
        .patchAndFetchById(connection.id, {
          squareWebhookSubscriptionId: result.subscriptionId,
          webhookSignatureKey: result.signatureKey,
          statusMessage: null,
        });
    } catch (err: any) {
      this.logger.warn(
        `Square webhook auto-registration failed for connection ${connection.id}: ${err?.message ?? err}`,
      );
      await this.connectionModel()
        .query()
        .patchAndFetchById(connection.id, {
          statusMessage: `Webhook auto-registration failed: ${
            err?.message ?? 'unknown error'
          }. Set the webhook signature key manually in the wizard.`,
        });
    }
  }
}
