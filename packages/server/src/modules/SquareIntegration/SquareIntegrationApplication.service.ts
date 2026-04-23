import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandleSquareOAuthCallback } from './commands/HandleSquareOAuthCallback.service';
import { UpdateSquareConnectionSettings } from './commands/UpdateSquareConnectionSettings.service';
import { DisconnectSquareConnection } from './commands/DisconnectSquareConnection.service';
import { UpsertSquareItemMapping } from './commands/UpsertSquareItemMapping.service';
import { GetSquareConnections } from './queries/GetSquareConnections.service';
import { GetSquareCatalogItems } from './queries/GetSquareCatalogItems.service';
import { GetSquareLocations } from './queries/GetSquareLocations.service';
import { GetSquareEventLog } from './queries/GetSquareEventLog.service';
import { UpdateSquareSettingsDto } from './dtos/UpdateSquareSettings.dto';
import { UpsertItemMappingDto } from './dtos/UpsertItemMapping.dto';

/**
 * Thin facade used by the controller; keeps business orchestration out of
 * the HTTP layer and makes the pieces individually testable.
 */
@Injectable()
export class SquareIntegrationApplication {
  constructor(
    private readonly config: ConfigService,
    private readonly oauthCallback: HandleSquareOAuthCallback,
    private readonly updateSettings: UpdateSquareConnectionSettings,
    private readonly disconnectConnection: DisconnectSquareConnection,
    private readonly upsertItemMappingService: UpsertSquareItemMapping,
    private readonly connectionsQuery: GetSquareConnections,
    private readonly catalogQuery: GetSquareCatalogItems,
    private readonly locationsQuery: GetSquareLocations,
    private readonly eventLogQuery: GetSquareEventLog,
  ) {}

  /**
   * Build the OAuth authorization URL the browser should redirect to.
   * Scopes kept to the minimum for v1 + v2 (read-only across the surfaces
   * we plan to ingest).
   */
  public getOAuthAuthorizationUrl(environment?: string, state?: string) {
    const env =
      environment ??
      this.config.get<string>('SQUARE_ENVIRONMENT') ??
      'production';
    const appId = this.config.get<string>('SQUARE_APPLICATION_ID');
    const redirect = this.config.get<string>('SQUARE_OAUTH_REDIRECT_URL');
    if (!appId || !redirect) {
      throw new Error(
        'Square OAuth is not configured (SQUARE_APPLICATION_ID / SQUARE_OAUTH_REDIRECT_URL).',
      );
    }
    const base =
      env === 'sandbox'
        ? 'https://connect.squareupsandbox.com'
        : 'https://connect.squareup.com';
    const scopes = [
      'MERCHANT_PROFILE_READ',
      'PAYMENTS_READ',
      'ORDERS_READ',
      'INVOICES_READ',
      'CUSTOMERS_READ',
      'ITEMS_READ',
    ].join('+');
    const qs = new URLSearchParams({
      client_id: appId,
      scope: scopes.replace(/\+/g, ' '),
      session: 'false',
      redirect_uri: redirect,
    });
    if (state) qs.set('state', state);
    return { url: `${base}/oauth2/authorize?${qs.toString()}`, environment: env };
  }

  public handleOAuthCallback(code: string, environment?: string) {
    return this.oauthCallback.handleCallback(code, environment);
  }

  public listConnections() {
    return this.connectionsQuery.list();
  }

  public getConnection(id: number) {
    return this.connectionsQuery.getById(id);
  }

  public updateConnectionSettings(id: number, dto: UpdateSquareSettingsDto) {
    return this.updateSettings.update(id, dto);
  }

  public disconnect(id: number) {
    return this.disconnectConnection.disconnect(id);
  }

  public listCatalog(connectionId: number, cursor?: string) {
    return this.catalogQuery.list(connectionId, cursor);
  }

  public listLocations(connectionId: number) {
    return this.locationsQuery.list(connectionId);
  }

  public upsertItemMapping(connectionId: number, dto: UpsertItemMappingDto) {
    return this.upsertItemMappingService.upsert(connectionId, dto);
  }

  public listEventLog(
    connectionId: number,
    params: {
      status?: string;
      eventType?: string;
      limit?: number;
      cursor?: number;
    } = {},
  ) {
    return this.eventLogQuery.list(connectionId, params);
  }
}
