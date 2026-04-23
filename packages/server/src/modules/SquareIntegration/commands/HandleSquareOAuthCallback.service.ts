import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';
import { SquareApiClient } from '../utils/SquareApiClient.service';
import { TokenEncryption } from '../utils/TokenEncryption.service';

@Injectable()
export class HandleSquareOAuthCallback {
  constructor(
    private readonly config: ConfigService,
    private readonly squareApi: SquareApiClient,
    private readonly tokenEncryption: TokenEncryption,

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
      await this.connectionModel()
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
        // Signing key generated locally; registered with Square when the
        // user finishes the wizard and we call the Webhook Subscriptions API.
        webhookSignatureKey: crypto.randomBytes(32).toString('hex'),
        status: 'pending',
        connectedAt: new Date(),
      });
    return { connectionId: created.id, isNew: true };
  }
}
