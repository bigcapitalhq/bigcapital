import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { SkipSerialize } from '@/common/decorators/SkipSerialize.decorator';
import { AuthThrottle } from '@/modules/App/AppThrottle.throttlers';
import { AuthSigninResponseDto } from '@/modules/Auth/dtos/AuthSigninResponse.dto';
import { PublicRoute } from '@/modules/Auth/guards/jwt.guard';
import { SamlSigninService } from './SamlSignin.service';
import { SamlProtocolService, SAML_LOGIN_TTL_MS } from './SamlProtocol.service';

@Controller('auth/saml')
@ApiTags('Auth')
@PublicRoute()
@AuthThrottle()
export class SamlController {
  constructor(
    private readonly protocol: SamlProtocolService,
    private readonly signin: SamlSigninService,
    private readonly config: ConfigService,
  ) {}

  private get callbackPage() {
    return new URL(
      '/auth/saml/callback',
      this.config.getOrThrow<string>('app.baseUrl'),
    );
  }

  private get browserCookie() {
    const secure = this.callbackPage.protocol === 'https:';
    return {
      name: secure ? '__Host-bigcapital-saml' : 'bigcapital-saml',
      options: { path: '/', httpOnly: true, secure, sameSite: 'lax' as const },
    };
  }

  @Get(':organizationId/metadata')
  @ApiOperation({
    summary: 'Get SAML service provider metadata for an organization',
  })
  @ApiOkResponse({
    content: { 'application/samlmetadata+xml': { schema: { type: 'string' } } },
  })
  metadata(
    @Param('organizationId') organizationId: string,
    @Res() res: Response,
  ) {
    res
      .type('application/samlmetadata+xml')
      .send(this.protocol.metadata(organizationId));
  }

  @Get(':organizationId/login')
  @ApiOperation({ summary: 'Start organization SAML sign-in' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to the identity provider or sign-in error page.',
  })
  async start(
    @Param('organizationId') organizationId: string,
    @Res() res: Response,
  ) {
    res.set('Cache-Control', 'no-store');
    try {
      const { redirectUrl, browserSecret } =
        await this.protocol.start(organizationId);
      const cookie = this.browserCookie;
      res.cookie(cookie.name, browserSecret, {
        ...cookie.options,
        maxAge: SAML_LOGIN_TTL_MS + 60000,
      });
      res.redirect(redirectUrl);
    } catch {
      res.redirect('/auth/saml/callback?error=saml');
    }
  }

  @Post(':organizationId/acs')
  @SkipSerialize()
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'Receive the signed SAML assertion from the identity provider',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['RelayState', 'SAMLResponse'],
      properties: {
        RelayState: { type: 'string' },
        SAMLResponse: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 303,
    description: 'Return the browser to the sign-in callback.',
  })
  async accept(
    @Param('organizationId') organizationId: string,
    @Body('RelayState') relay: unknown,
    @Body('SAMLResponse') response: unknown,
    @Res() res: Response,
  ) {
    const page = this.callbackPage;
    try {
      const code = await this.protocol.accept(organizationId, relay, response);
      page.hash = `code=${code}`;
    } catch {
      page.searchParams.set('error', 'saml');
    }
    res.set('Cache-Control', 'no-store').redirect(303, page.toString());
  }

  @Post('exchange')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Redeem a single-use SAML sign-in code in the initiating browser',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['code'],
      properties: { code: { type: 'string' } },
    },
  })
  @ApiOkResponse({ type: AuthSigninResponseDto })
  async exchange(
    @Body('code') code: unknown,
    @Headers('cookie') header: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookie = this.browserCookie;
    const prefix = cookie.name + '=';
    const value = header
      ?.split(';')
      .map((pair) => pair.trim())
      .find((pair) => pair.startsWith(prefix))
      ?.slice(prefix.length);
    const { organizationId, email } = await this.protocol.redeem(value, code);
    res.clearCookie(cookie.name, cookie.options);
    return this.signin.begin(organizationId, email);
  }
}
