import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import {
  AuthSigninResponseDto,
  AuthSigninSetupConfirmResponseDto,
} from './dtos/AuthSigninResponse.dto';
import { AuthMetaResponseDto } from './dtos/AuthMetaResponse.dto';
import {
  MfaChallengeDto,
  MfaMethodDescriptorDto,
  MfaPrepareDto,
  MfaPrepareResponseDto,
  MfaSetupConfirmDto,
  MfaSetupStartDto,
  MfaVerifyDto,
} from './dtos/MfaSignin.dto';
import { LocalAuthGuard } from './guards/Local.guard';
import { GoogleAuthGuard } from './guards/Google.guard';
import { AuthSigninService } from './commands/AuthSignin.service';
import { buildUrlWithQuery } from './Auth.utils';
import { SystemUser } from '../System/models/SystemUser';
import { NoActiveWorkspaceException } from './exceptions/NoActiveWorkspace.exception';
import { TwoFactorSigninService } from './two-factor/TwoFactorSignin.service';
import {
  TwoFactorSigninDto,
  TwoFactorSigninSetupConfirmDto,
  TwoFactorSigninSetupDto,
} from './two-factor/dtos/TwoFactorSignin.dto';
import { TwoFactorSetupResponseDto } from './two-factor/dtos/TwoFactor.dto';
import { AuthThrottle } from '../App/AppThrottle.throttlers';

@Controller('/auth')
@ApiTags('Auth')
@ApiExtraModels(
  AuthSigninResponseDto,
  AuthSigninSetupConfirmResponseDto,
  AuthMetaResponseDto,
  TwoFactorSetupResponseDto,
  MfaChallengeDto,
  MfaMethodDescriptorDto,
  MfaPrepareResponseDto,
)
@PublicRoute()
@AuthThrottle()
export class AuthController {
  constructor(
    private readonly authApp: AuthenticationApplication,
    private readonly authSignin: AuthSigninService,
    private readonly twoFactorSignin: TwoFactorSigninService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: AuthSigninDto })
  @ApiResponse({
    status: 200,
    description:
      'Sign-in successful. Returns access token and tenant/organization IDs. When the user has two-factor authentication (or the organization requires it and the user has none yet), returns two_factor_required (or two_factor_setup_required) and a challenge_token instead of the access token.',
    schema: { $ref: getSchemaPath(AuthSigninResponseDto) },
  })
  async signin(
    @Request() req: Request & { user: SystemUser },
    @Body() signinDto: AuthSigninDto,
  ): Promise<AuthSigninResponseDto> {
    const { user } = req;
    const tenant = await this.authSignin.resolveSigninTenant(user);

    if (!tenant) {
      throw new NoActiveWorkspaceException();
    }
    const challenge = await this.twoFactorSignin.begin(
      user,
      tenant,
      signinDto?.rememberMe,
    );
    if (challenge) {
      return challenge;
    }
    return this.authSignin.issueSigninResponse(user, signinDto?.rememberMe);
  }

  @Post('/signin/2fa')
  @ApiOperation({
    summary:
      'Second sign-in step: a code from the authenticator app or a recovery code',
  })
  @ApiBody({ type: TwoFactorSigninDto })
  @ApiResponse({
    status: 200,
    description: 'The same response as a sign-in without two-factor.',
    schema: { $ref: getSchemaPath(AuthSigninResponseDto) },
  })
  async signinTwoFactor(
    @Body() body: TwoFactorSigninDto,
  ): Promise<AuthSigninResponseDto> {
    const { user, rememberMe } = await this.twoFactorSignin.complete(
      body.challengeToken,
      body.code,
      body.recoveryCode,
    );
    return this.authSignin.issueSigninResponse(user, rememberMe);
  }

  @Post('/signin/mfa/verify')
  @ApiOperation({
    summary:
      'Second sign-in step: verify the credential of the selected method',
  })
  @ApiBody({ type: MfaVerifyDto })
  @ApiResponse({
    status: 200,
    description: 'The same response as a sign-in without two-factor.',
    schema: { $ref: getSchemaPath(AuthSigninResponseDto) },
  })
  async signinMfaVerify(
    @Body() body: MfaVerifyDto,
  ): Promise<AuthSigninResponseDto> {
    const { user, rememberMe } = await this.twoFactorSignin.completeWithMethod(
      body.challengeToken,
      body.method,
      { code: body.code, recoveryCode: body.recoveryCode },
    );
    return this.authSignin.issueSigninResponse(user, rememberMe);
  }

  @Post('/signin/mfa/prepare')
  @ApiOperation({
    summary:
      'Prepare a method before verification, e.g. send an email code or return WebAuthn options',
  })
  @ApiBody({ type: MfaPrepareDto })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(MfaPrepareResponseDto) },
  })
  signinMfaPrepare(
    @Body() body: MfaPrepareDto,
  ): Promise<MfaPrepareResponseDto> {
    return this.twoFactorSignin.prepare(body.challengeToken, body.method);
  }

  @Post('/signin/mfa/setup/start')
  @ApiOperation({
    summary:
      'Required two-factor setup during sign-in: start the setup of a method',
  })
  @ApiBody({ type: MfaSetupStartDto })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(TwoFactorSetupResponseDto) },
  })
  async signinMfaSetupStart(
    @Body() body: MfaSetupStartDto,
  ): Promise<TwoFactorSetupResponseDto> {
    const setup = await this.twoFactorSignin.startSetup(
      body.challengeToken,
      body.method ?? 'totp',
    );
    return setup as TwoFactorSetupResponseDto;
  }

  @Post('/signin/mfa/setup/confirm')
  @ApiOperation({
    summary:
      'Confirm the required setup with a credential: turns the method on and signs in',
  })
  @ApiBody({ type: MfaSetupConfirmDto })
  @ApiResponse({
    status: 200,
    description: 'The sign-in response plus recovery_codes (shown once).',
    schema: { $ref: getSchemaPath(AuthSigninSetupConfirmResponseDto) },
  })
  async signinMfaSetupConfirm(
    @Body() body: MfaSetupConfirmDto,
  ): Promise<AuthSigninSetupConfirmResponseDto> {
    const { user, rememberMe, recoveryCodes } =
      await this.twoFactorSignin.confirmSetup(
        body.challengeToken,
        body.code,
        body.method ?? 'totp',
      );
    const response = await this.authSignin.issueSigninResponse(
      user,
      rememberMe,
    );
    return { ...response, recoveryCodes };
  }

  @Post('/signin/2fa/setup')
  @ApiOperation({
    summary:
      'Required two-factor setup during sign-in: returns a new secret and its otpauth URI',
  })
  @ApiBody({ type: TwoFactorSigninSetupDto })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(TwoFactorSetupResponseDto) },
  })
  async signinTwoFactorSetup(
    @Body() body: TwoFactorSigninSetupDto,
  ): Promise<TwoFactorSetupResponseDto> {
    const setup = await this.twoFactorSignin.startSetup(
      body.challengeToken,
      'totp',
    );
    return setup as TwoFactorSetupResponseDto;
  }

  @Post('/signin/2fa/setup/confirm')
  @ApiOperation({
    summary:
      'Confirm the required setup with a code: turns two-factor on and signs in',
  })
  @ApiBody({ type: TwoFactorSigninSetupConfirmDto })
  @ApiResponse({
    status: 200,
    description: 'The sign-in response plus recovery_codes (shown once).',
    schema: { $ref: getSchemaPath(AuthSigninSetupConfirmResponseDto) },
  })
  async signinTwoFactorSetupConfirm(
    @Body() body: TwoFactorSigninSetupConfirmDto,
  ): Promise<AuthSigninSetupConfirmResponseDto> {
    const { user, rememberMe, recoveryCodes } =
      await this.twoFactorSignin.confirmSetup(
        body.challengeToken,
        body.code,
        'totp',
      );
    const response = await this.authSignin.issueSigninResponse(
      user,
      rememberMe,
    );
    return { ...response, recoveryCodes };
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
