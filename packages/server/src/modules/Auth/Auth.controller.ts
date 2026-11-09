import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PublicRoute } from './guards/jwt.guard';
import { AuthenticationApplication } from './AuthApplication.sevice';
import { AuthSignupDto } from './dtos/AuthSignup.dto';
import { AuthSigninDto } from './dtos/AuthSignin.dto';
import { AuthSignupVerifyDto } from './dtos/AuthSignupVerify.dto';
import { AuthSendResetPasswordDto } from './dtos/AuthSendResetPassword.dto';
import { AuthResetPasswordDto } from './dtos/AuthResetPassword.dto';
import { AuthSigninResponseDto } from './dtos/AuthSigninResponse.dto';
import { AuthMetaResponseDto } from './dtos/AuthMetaResponse.dto';
import { LocalAuthGuard } from './guards/Local.guard';
import { GoogleAuthGuard } from './guards/Google.guard';
import { AuthSigninService } from './commands/AuthSignin.service';
import { buildUrlWithQuery } from './Auth.utils';
import { SystemUser } from '../System/models/SystemUser';

@Controller('/auth')
@ApiTags('Auth')
@ApiExtraModels(AuthSigninResponseDto, AuthMetaResponseDto)
@PublicRoute()
@Throttle({ auth: {} })
export class AuthController {
  constructor(
    private readonly authApp: AuthenticationApplication,
    private readonly authSignin: AuthSigninService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: AuthSigninDto })
  @ApiResponse({
    status: 200,
    description:
      'Sign-in successful. Returns access token and tenant/organization IDs.',
    schema: { $ref: getSchemaPath(AuthSigninResponseDto) },
  })
  async signin(
    @Request() req: Request & { user: SystemUser },
    @Body() signinDto: AuthSigninDto,
  ): Promise<AuthSigninResponseDto> {
    const { user } = req;
    const tenant = await this.authSignin.resolveSigninTenant(user);

    if (!tenant) {
      throw new UnauthorizedException({
        message:
          'No active workspace available. Please contact the administrator.',
        errors: [{ type: 'ORGANIZATION.INACTIVE' }],
      });
    }

    return {
      accessToken: this.authSignin.signToken(user, signinDto?.rememberMe),
      organizationId: tenant.organizationId,
      tenantId: tenant.id,
      userId: user.id,
    };
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: AuthSignupDto })
  @ApiResponse({
    status: 201,
    description: 'Sign-up initiated. Check email for confirmation.',
  })
  signup(@Request() req: Request, @Body() signupDto: AuthSignupDto) {
    return this.authApp.signUp(signupDto);
  }

  @Post('/signup/verify')
  @ApiOperation({ summary: 'Confirm user signup' })
  @ApiBody({ type: AuthSignupVerifyDto })
  @ApiResponse({ status: 200, description: 'Signup confirmed successfully.' })
  signupConfirm(@Body() body: AuthSignupVerifyDto) {
    return this.authApp.signUpConfirm(body.email, body.token);
  }

  @Post('/send_reset_password')
  @ApiOperation({ summary: 'Send reset password email' })
  @ApiBody({ type: AuthSendResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Reset password email sent if the account exists.',
  })
  sendResetPassword(@Body() body: AuthSendResetPasswordDto) {
    return this.authApp.sendResetPassword(body.email);
  }

  @Post('/reset_password/:token')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiParam({
    name: 'token',
    description: 'Reset password token from email link',
  })
  @ApiBody({ type: AuthResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  resetPassword(
    @Param('token') token: string,
    @Body() body: AuthResetPasswordDto,
  ) {
    return this.authApp.resetPassword(token, body.password);
  }

  @Get('/meta')
  @ApiOperation({ summary: 'Get auth metadata (e.g. signup disabled)' })
  @ApiResponse({
    status: 200,
    description: 'Auth metadata for the login/signup page.',
    schema: { $ref: getSchemaPath(AuthMetaResponseDto) },
  })
  meta(): Promise<AuthMetaResponseDto> {
    return this.authApp.getAuthMeta();
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google')
  @ApiOperation({ summary: 'Start sign-in with Google' })
  @ApiResponse({
    status: 302,
    description: 'Redirects the browser to the Google consent screen.',
  })
  googleAuth(): void {
    // The GoogleAuthGuard starts the OAuth redirect; this body is never hit.
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({
    status: 302,
    description:
      'Redirects to the web app with a JWT access token or an error code.',
  })
  async googleAuthCallback(
    @Request() req: Request & { user: SystemUser },
    @Res() res: Response,
  ): Promise<void> {
    // The guard already redirected to the failure URL when authentication
    // failed (or the user declined the consent screen).
    if (res.headersSent || !req.user) {
      return;
    }
    const { user } = req;
    const tenant = await this.authSignin.resolveSigninTenant(user);
    const failureRedirectUrl = this.configService.get<string>(
      'google.failureRedirectUrl',
    );

    if (!tenant) {
      res.redirect(
        buildUrlWithQuery(failureRedirectUrl, {
          error: 'no_active_workspace',
        }),
      );
      return;
    }
    const successRedirectUrl = this.configService.get<string>(
      'google.successRedirectUrl',
    );
    res.redirect(
      buildUrlWithQuery(successRedirectUrl, {
        token: this.authSignin.signToken(user),
        user_id: user.id,
        tenant_id: tenant.id,
        organization_id: tenant.organizationId,
      }),
    );
  }
}
