import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';
import { VerifySquareSignature } from '../utils/VerifySquareSignature.service';
import { SquareEventRouter } from './SquareEventRouter.service';
import { PublicRoute } from '@/modules/Auth/guards/jwt.guard';

/**
 * Public webhook endpoint — bypasses JWT auth (security = HMAC signature
 * on the request). Traefik must also route this path without OAuth
 * forward-auth; see the fork's Traefik dynamic config.
 *
 * Keep this handler fast: persist + dispatch then return 200. Any non-2xx
 * response causes Square to retry with exponential backoff, which will
 * stack up duplicates in the log (handled by the dedup index) but also
 * delay legitimate events.
 */
@Controller('/integrations/square/webhooks')
@ApiExcludeController()
export class SquareWebhookController {
  constructor(
    private readonly signatureVerifier: VerifySquareSignature,
    private readonly eventRouter: SquareEventRouter,
    private readonly config: ConfigService,

    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  @Post(':connectionId')
  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  async receive(
    @Param('connectionId') connectionIdParam: string,
    @Headers('x-square-hmacsha256-signature') signature: string | undefined,
    @Req() req: Request,
    @Body() body: any,
  ) {
    const connectionId = Number(connectionIdParam);
    if (!Number.isFinite(connectionId)) {
      return { ok: false, reason: 'invalid_connection' };
    }
    const connection = await this.connectionModel()
      .query()
      .findById(connectionId);
    // Do not leak existence: always return 200 on auth failure so attackers
    // can't enumerate valid connection ids.
    if (!connection || connection.status === 'disabled') {
      return { ok: false };
    }

    // Raw body is attached by a NestJS middleware (see module bootstrap) so
    // signature verification sees the exact bytes Square signed. Fall back
    // to re-serializing the parsed body for environments without that hook.
    const rawBody: string =
      (req as any).rawBody?.toString('utf8') ?? JSON.stringify(body ?? {});

    const publicBase = this.config.get<string>('BASE_URL') ?? '';
    const notificationUrl = `${publicBase.replace(/\/$/, '')}/api/integrations/square/webhooks/${connectionId}`;

    const ok = this.signatureVerifier.verify(
      rawBody,
      notificationUrl,
      signature,
      connection.webhookSignatureKey,
    );
    if (!ok) {
      return { ok: false, reason: 'signature' };
    }

    const eventId = body?.event_id ?? body?.merchant_id + ':' + body?.created_at;
    const eventType = body?.type ?? 'unknown';

    const { logged, entryId } = await this.eventRouter.record({
      connectionId,
      squareEventId: eventId,
      eventType,
      payload: body,
    });
    if (logged && entryId) {
      // Phase-1: no handler wired; just mark done for telemetry.
      await this.eventRouter.dispatch(entryId);
    }
    return { ok: true };
  }
}
