import * as crypto from 'crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';
import { SquareApiClient } from '../utils/SquareApiClient.service';
import { TokenEncryption } from '../utils/TokenEncryption.service';
import { EnsureSquareApplicationWebhook } from './EnsureSquareApplicationWebhook.service';
import { UpsertSquareMerchantIndex } from './UpsertSquareMerchantIndex.service';

@Injectable()
export class HandleSquareOAuthCallback {
  private readonly logger = new Logger(HandleSquareOAuthCallback.name);

  constructor(
    private readonly config: ConfigService,
    private readonly squareApi: SquareApiClient,
    private readonly tokenEncryption: TokenEncryption,
    private readonly ensureAppWebhook: EnsureSquareApplicationWebhook,
    private readonly merchantIndex: UpsertSquareMerchantIndex,
    private readonly cls: ClsService,

    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  /**
   * Exchange the OAuth code → tokens, upsert the connection row in `pending`
   * status (the wizard completes configuration before flipping to `active`).
   * Also (a) writes a (merchantId, environment) → (organizationId, connectionId)
   * row into the system DB merchant index so the app-level webhook receiver
   * can route inbound events without tenant context, and (b) idempotently
   * ensures the app-level Square subscription exists.
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

    let connectionId: number;
    let isNew: boolean;

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
      connectionId = existing.id;
      isNew = false;
    } else {
      const created = await this.connectionModel()
        .query()
        .insert({
          merchantId: tokens.merchantId,
          environment: env,
          accessTokenEncrypted,
          refreshTokenEncrypted,
          tokenExpiresAt: tokens.expiresAt,
          // Per-connection signature key column is no longer used for HMAC
          // verification (the app-level subscription owns the key); we
          // retain a placeholder so the column stays NOT NULL-friendly for
          // any historic readers and so a future migration can drop it.
          webhookSignatureKey: crypto.randomBytes(32).toString('hex'),
          status: 'pending',
          connectedAt: new Date(),
        });
      connectionId = created.id;
      isNew = true;
    }

    // System-DB index lookup table for the app-level webhook receiver.
    const organizationId = this.cls.get<string>('organizationId');
    if (organizationId) {
      try {
        await this.merchantIndex.upsert({
          merchantId: tokens.merchantId,
          environment: env,
          organizationId,
          connectionId,
        });
      } catch (err: any) {
        this.logger.warn(
          `Failed to upsert square_merchant_index for ${tokens.merchantId}: ${
            err?.message ?? err
          }`,
        );
      }
    }

    // Idempotently ensure the app-level Square webhook subscription
    // exists. Best-effort — admins can call this lazily on demand if
    // the bootstrap fails (e.g. PAT not yet configured).
    try {
      await this.ensureAppWebhook.ensure(env);
    } catch (err: any) {
      this.logger.warn(
        `Failed to ensure app-level Square webhook for env=${env}: ${
          err?.message ?? err
        }`,
      );
    }

    return { connectionId, isNew };
  }
}
