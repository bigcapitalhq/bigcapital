import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { SquareIntegrationApplication } from './SquareIntegrationApplication.service';
import { SquareOAuthStartDto } from './dtos/SquareOAuth.dto';
import { UpdateSquareSettingsDto } from './dtos/UpdateSquareSettings.dto';
import { UpsertItemMappingDto } from './dtos/UpsertItemMapping.dto';
import { PublicRoute } from '@/modules/Auth/guards/jwt.guard';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

// OAuth state is a short-lived JWT carrying the initiating tenant's
// organizationId. Square's callback redirect has no cookie/header context
// (third-party browser hop), so we use `state` as both the anti-CSRF token
// and the tenant-identity carrier.
const STATE_TOKEN_TYPE = 'square-oauth-state';
const STATE_TOKEN_TTL = '10m';

@Controller('/integrations/square')
@ApiTags('Square Integration')
export class SquareIntegrationController {
  constructor(
    private readonly application: SquareIntegrationApplication,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly cls: ClsService,
    private readonly tenancyContext: TenancyContext,
  ) {}

  @Get('oauth/start')
  async oauthStart(@Query() query: SquareOAuthStartDto) {
    const tenant = await this.tenancyContext.getTenant();
    const state = this.jwtService.sign(
      { oid: tenant.organizationId, typ: STATE_TOKEN_TYPE },
      { expiresIn: STATE_TOKEN_TTL },
    );
    return this.application.getOAuthAuthorizationUrl(query.environment, state);
  }

  /**
   * OAuth redirect handler. Square redirects the user's browser here with
   * `code` + optional `state`. Public so the browser-return hop succeeds
   * without a JWT — we exchange the code server-side then redirect to the
   * webapp's post-connect wizard.
   */
  @Get('oauth/callback')
  @PublicRoute()
  async oauthCallback(
    @Query('code') code: string,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Res() res: Response,
  ) {
    const webappBase =
      this.config.get<string>('WEBAPP_BASE_URL') ??
      this.config.get<string>('BASE_URL') ??
      '';
    const wizardPath = '/preferences/integrations/square';

    if (error) {
      return res.redirect(
        `${webappBase}${wizardPath}?status=error&reason=${encodeURIComponent(error)}`,
      );
    }
    if (!code) {
      return res.redirect(`${webappBase}${wizardPath}?status=error&reason=missing_code`);
    }
    if (!state) {
      return res.redirect(`${webappBase}${wizardPath}?status=error&reason=missing_state`);
    }

    // Verify + decode the state token, then seed CLS with the originating
    // tenant's organizationId so downstream TenantModelProxy queries hit
    // the right tenant DB. Square's redirect carries no cookies, so this
    // is the only channel by which the callback knows which tenant to use.
    let organizationId: string;
    try {
      const payload = this.jwtService.verify<{ oid: string; typ: string }>(state);
      if (payload.typ !== STATE_TOKEN_TYPE || !payload.oid) {
        throw new Error('invalid_state');
      }
      organizationId = payload.oid;
    } catch {
      return res.redirect(`${webappBase}${wizardPath}?status=error&reason=invalid_state`);
    }
    this.cls.set('organizationId', organizationId);

    try {
      const result = await this.application.handleOAuthCallback(code);
      return res.redirect(
        `${webappBase}${wizardPath}/${result.connectionId}/setup?status=ok`,
      );
    } catch {
      return res.redirect(
        `${webappBase}${wizardPath}?status=error&reason=oauth_failed`,
      );
    }
  }

  @Get('connections')
  listConnections() {
    return this.application.listConnections();
  }

  @Get('connections/:id')
  getConnection(@Param('id', ParseIntPipe) id: number) {
    return this.application.getConnection(id);
  }

  @Patch('connections/:id/settings')
  updateSettings(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSquareSettingsDto,
  ) {
    return this.application.updateConnectionSettings(id, dto);
  }

  @Delete('connections/:id')
  disconnect(@Param('id', ParseIntPipe) id: number) {
    return this.application.disconnect(id);
  }

  @Get('connections/:id/catalog')
  listCatalog(
    @Param('id', ParseIntPipe) id: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.application.listCatalog(id, cursor);
  }

  @Get('connections/:id/locations')
  listLocations(@Param('id', ParseIntPipe) id: number) {
    return this.application.listLocations(id);
  }

  @Put('connections/:id/catalog/mapping')
  upsertItemMapping(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertItemMappingDto,
  ) {
    return this.application.upsertItemMapping(id, dto);
  }

  @Get('connections/:id/events')
  listEvents(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status?: string,
    @Query('eventType') eventType?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.application.listEventLog(id, {
      status,
      eventType,
      limit: limit ? Number(limit) : undefined,
      cursor: cursor ? Number(cursor) : undefined,
    });
  }
}
