import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TokenEncryption } from './TokenEncryption.service';
import { SquareConnection } from '../models/SquareConnection.model';

const SQUARE_API_VERSION = '2024-10-17';

/**
 * Thin axios wrapper for calling Square's REST API on behalf of a specific
 * connection. Decrypts the access token on demand; refreshes and persists a
 * new token when Square returns 401 (token expired). Intentionally does NOT
 * use the Square SDK — we only need a handful of endpoints for v1 and
 * avoiding the dep keeps the image smaller.
 */
@Injectable()
export class SquareApiClient {
  private readonly logger = new Logger(SquareApiClient.name);

  constructor(
    private readonly config: ConfigService,
    private readonly tokenEncryption: TokenEncryption,
    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  public baseUrl(environment: string): string {
    return environment === 'sandbox'
      ? 'https://connect.squareupsandbox.com'
      : 'https://connect.squareup.com';
  }

  /**
   * Build an axios instance bound to a connection's environment + access
   * token. Callers should use this.request(conn, ...) instead which also
   * handles refresh-on-401.
   */
  private makeAxios(
    environment: string,
    accessToken: string | null,
  ): AxiosInstance {
    return axios.create({
      baseURL: this.baseUrl(environment),
      headers: {
        'Square-Version': SQUARE_API_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      // Square sometimes returns 4xx with useful bodies; let us inspect.
      validateStatus: () => true,
    });
  }

  /**
   * Exchange an OAuth authorization code for access + refresh tokens.
   * Uses the application-level secret — NOT the per-connection bearer token.
   */
  public async exchangeOAuthCode(
    code: string,
    environment: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    merchantId: string;
  }> {
    const appId = this.config.get<string>('SQUARE_APPLICATION_ID');
    const appSecret = this.config.get<string>('SQUARE_APPLICATION_SECRET');
    const redirectUri = this.config.get<string>('SQUARE_OAUTH_REDIRECT_URL');
    if (!appId || !appSecret || !redirectUri) {
      throw new Error(
        'Square OAuth app credentials are not configured (SQUARE_APPLICATION_ID / SQUARE_APPLICATION_SECRET / SQUARE_OAUTH_REDIRECT_URL).',
      );
    }
    const client = this.makeAxios(environment, null);
    const res = await client.post('/oauth2/token', {
      client_id: appId,
      client_secret: appSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });
    if (res.status !== 200) {
      throw new Error(
        `Square OAuth token exchange failed: ${res.status} ${JSON.stringify(res.data)}`,
      );
    }
    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
      expiresAt: new Date(res.data.expires_at),
      merchantId: res.data.merchant_id,
    };
  }

  /**
   * Refresh an access token using the stored refresh token. Persists the
   * new token + expiry back onto the connection row.
   */
  public async refreshAccessToken(
    connection: SquareConnection,
  ): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date }> {
    const appId = this.config.get<string>('SQUARE_APPLICATION_ID');
    const appSecret = this.config.get<string>('SQUARE_APPLICATION_SECRET');
    if (!connection.refreshTokenEncrypted) {
      throw new Error('Connection has no refresh token; user must reconnect.');
    }
    const refreshToken = this.tokenEncryption.decrypt(
      connection.refreshTokenEncrypted,
    );
    const client = this.makeAxios(connection.environment, null);
    const res = await client.post('/oauth2/token', {
      client_id: appId,
      client_secret: appSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    if (res.status !== 200) {
      throw new Error(
        `Square token refresh failed: ${res.status} ${JSON.stringify(res.data)}`,
      );
    }
    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token ?? refreshToken,
      expiresAt: new Date(res.data.expires_at),
    };
  }

  /**
   * Make an authenticated API call against the connection. Returns the
   * raw axios response. 5xx and 429 are surfaced as-is. 401 triggers a
   * single transparent token-refresh-then-retry: the new tokens are
   * encrypted, persisted to the connection row, and the in-memory
   * `connection` object is updated so the caller sees the latest values.
   * If the refresh itself fails (revoked/disconnected), the original 401
   * is returned to the caller.
   */
  public async request(
    connection: SquareConnection,
    config: AxiosRequestConfig,
  ) {
    if (!connection.accessTokenEncrypted) {
      throw new Error(
        'Connection has no access token; complete OAuth before calling the API.',
      );
    }
    let accessToken = this.tokenEncryption.decrypt(
      connection.accessTokenEncrypted,
    );
    let client = this.makeAxios(connection.environment, accessToken);
    let res = await client.request(config);

    if (res.status === 401 && connection.refreshTokenEncrypted) {
      try {
        const refreshed = await this.refreshAccessToken(connection);
        const newAccessEncrypted = this.tokenEncryption.encrypt(
          refreshed.accessToken,
        );
        const newRefreshEncrypted = this.tokenEncryption.encrypt(
          refreshed.refreshToken,
        );
        await this.connectionModel()
          .query()
          .patchAndFetchById(connection.id, {
            accessTokenEncrypted: newAccessEncrypted,
            refreshTokenEncrypted: newRefreshEncrypted,
            tokenExpiresAt: refreshed.expiresAt,
          });
        // Update the in-memory object so callers holding it see fresh
        // values (and downstream handlers in the same call don't re-401).
        connection.accessTokenEncrypted = newAccessEncrypted;
        connection.refreshTokenEncrypted = newRefreshEncrypted;
        connection.tokenExpiresAt = refreshed.expiresAt;

        client = this.makeAxios(connection.environment, refreshed.accessToken);
        res = await client.request(config);
      } catch (err: any) {
        this.logger.warn(
          `Square token refresh failed for connection ${connection.id}: ${
            err?.message ?? err
          }. Returning original 401.`,
        );
      }
    }
    return res;
  }

  /**
   * Call Square's API with the application's PAT (Personal Access Token)
   * instead of a seller's OAuth token. Required for the Subscriptions API
   * (POST /v2/webhooks/subscriptions) and any other app-level endpoint
   * that authenticates against the application, not a specific merchant.
   *
   * The PAT comes from `SQUARE_APPLICATION_ACCESS_TOKEN` in the env. Each
   * deploy serves a single Square environment (sandbox or production), so
   * a single env var per deploy suffices.
   */
  public async requestWithApplicationToken(
    environment: string,
    config: AxiosRequestConfig,
  ) {
    const pat = this.config.get<string>('SQUARE_APPLICATION_ACCESS_TOKEN');
    if (!pat) {
      throw new Error(
        'SQUARE_APPLICATION_ACCESS_TOKEN is not configured; cannot call app-level Square APIs.',
      );
    }
    const client = this.makeAxios(environment, pat);
    return client.request(config);
  }
}
