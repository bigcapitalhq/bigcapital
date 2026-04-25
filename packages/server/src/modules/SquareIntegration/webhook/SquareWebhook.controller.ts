import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';
import { VerifySquareSignature } from '../utils/VerifySquareSignature.service';
import { SquareEventRouter } from './SquareEventRouter.service';
import { EnsureSquareApplicationWebhook } from '../commands/EnsureSquareApplicationWebhook.service';
import { UpsertSquareMerchantIndex } from '../commands/UpsertSquareMerchantIndex.service';
import { PublicRoute } from '@/modules/Auth/guards/jwt.guard';
import { TenantAgnosticRoute } from '@/modules/Tenancy/TenancyGlobal.guard';

/**
 * App-level webhook receiver. Squares Subscriptions API authenticates
 * with the application PAT, so subscriptions are app-scoped and a single
 * notification URL handles every connected sellers events. We:
 *
 *   1. verify HMAC against the app-level signature key (system DB),
 *   2. look up which tenant owns the payloads merchant_id via the
 *      square_merchant_index table (system DB),
 *   3. set CLS organizationId so tenant-scoped queries work,
 *   4. load the tenant connection and dispatch.
 *
 * Bypasses JWT auth (HMAC is the auth) AND tenant-context guard (we set
 * the org id ourselves after merchant_id lookup). Traefik must also route
 * this path without OAuth forward-auth — see the dynamic config.
 *
 * Always returns 200 on auth/lookup failure so attackers cannot enumerate
 * which merchants we have on file. Square retries non-2xx responses with
 * exponential backoff, which would stack duplicate logs.
 */
@Controller('/integrations/square/webhooks')
@ApiExcludeController()
export class SquareWebhookController {
  private readonly logger = new Logger(SquareWebhookController.name);

  constructor(
    private readonly signatureVerifier: VerifySquareSignature,
    private readonly eventRouter: SquareEventRouter,
    private readonly config: ConfigService,
    private readonly cls: ClsService,
    private readonly appWebhook: EnsureSquareApplicationWebhook,
    private readonly merchantIndex: UpsertSquareMerchantIndex,

    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  @Post()
  @PublicRoute()
  @TenantAgnosticRoute()
  @HttpCode(HttpStatus.OK)
  async receive(
    @Headers('x-square-hmacsha256-signature') signature: string | undefined,
    @Req() req: Request,
    @Body() body: any,
  ) {
    // The global SerializeInterceptor camelCases inbound bodies, so even
    // though Square sends snake_case (merchant_id, event_id, created_at),
    // we read the camelCase form here. `req.rawBody` still contains the
    // original snake_case bytes, which is what HMAC verifies against.
    const merchantId =
      body?.merchantId ?? body?.data?.object?.merchantId ?? null;
    const eventType = body?.type ?? 'unknown';
    const eventId =
      body?.eventId ?? `${merchantId ?? '?'}:${body?.createdAt ?? ''}`;

    this.logger.log(
      `Inbound Square webhook: type=${eventType} merchant=${
        merchantId ?? '?'
      } sig_present=${!!signature}`,
    );

    const env =
      this.config.get<string>('SQUARE_ENVIRONMENT') ?? 'production';

    const signatureKey = await this.appWebhook.getSignatureKey(env);
    if (!signatureKey) {
      this.logger.warn(
        `Webhook reject: no app-level subscription registered for env=${env}`,
      );
      return { ok: false, reason: 'no_subscription' };
    }

    // Raw body must be the exact bytes Square signed. NestJS body
    // middleware re-attaches it via `req.rawBody` when configured;
    // fall back to a re-serialization if the hook is missing.
    const rawBody: string =
      (req as any).rawBody?.toString('utf8') ?? JSON.stringify(body ?? {});

    const publicBase =
      (this.config.get<string>('BASE_URL') ?? '').replace(/\/$/, '');
    const notificationUrl = `${publicBase}/api/integrations/square/webhooks`;

    const ok = this.signatureVerifier.verify(
      rawBody,
      notificationUrl,
      signature,
      signatureKey,
    );
    if (!ok) {
      this.logger.warn(
        `Webhook reject: signature mismatch (notification_url=${notificationUrl}, raw_body_len=${rawBody.length})`,
      );
      return { ok: false, reason: 'signature' };
    }

    if (!merchantId) {
      this.logger.warn('Webhook reject: payload has no merchant_id');
      return { ok: false, reason: 'no_merchant_id' };
    }

    const indexRow = await this.merchantIndex.lookup(merchantId, env);
    if (!indexRow?.organizationId) {
      this.logger.warn(
        `Webhook reject: no merchant_index row for ${merchantId}/${env}`,
      );
      return { ok: false, reason: 'unknown_merchant' };
    }

    // Hop into the tenants CLS context for the rest of the handler so
    // TenantModelProxy resolves the right DB.
    this.cls.set('organizationId', indexRow.organizationId);

    const connection = await this.connectionModel()
      .query()
      .findOne({ merchantId, environment: env });

    if (!connection || connection.status === 'disabled') {
      this.logger.warn(
        `Webhook reject: connection not found or disabled for ${merchantId}/${env}`,
      );
      return { ok: false, reason: 'no_connection' };
    }

    const { logged, entryId } = await this.eventRouter.record({
      connectionId: connection.id,
      squareEventId: eventId,
      eventType,
      payload: body,
    });
    if (logged && entryId) {
      // Phase-1: no handler wired; just mark done for telemetry.
      await this.eventRouter.dispatch(entryId);
      this.logger.log(
        `Webhook accepted: ${eventType} ${eventId} → entry ${entryId}`,
      );
    } else {
      this.logger.log(
        `Webhook duplicate ignored: ${eventType} ${eventId}`,
      );
    }
    return { ok: true };
  }
}
