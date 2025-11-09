import {
  ApiBody,
  ApiExcludeController,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetAuthenticatedAccount } from './queries/GetAuthedAccount.service';
import { Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IgnoreTenantSeededRoute } from '../Tenancy/EnsureTenantIsSeeded.guards';
import { IgnoreTenantInitializedRoute } from '../Tenancy/EnsureTenantIsInitialized.guard';
import { AuthenticationApplication } from './AuthApplication.sevice';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { IgnoreUserVerifiedRoute } from './guards/EnsureUserVerified.guard';

@Controller('/auth')
@ApiTags('Auth')
@ApiExcludeController()
@IgnoreTenantSeededRoute()
@IgnoreTenantInitializedRoute()
@IgnoreUserVerifiedRoute()
@Throttle({ auth: {} })
export class AuthedController {
  constructor(
    private readonly getAuthedAccountService: GetAuthenticatedAccount,
    private readonly authApp: AuthenticationApplication,
  ) { }

  @Post('/signup/verify/resend')
  @ApiOperation({ summary: 'Resend the signup confirmation message' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        message: { type: 'string', example: 'resent successfully.' },
      },
    },
  })
  async resendSignupConfirm() {
    await this.authApp.signUpConfirmResend();

    return {
      code: 200,
      message: 'The signup confirmation message has been resent successfully.',
    };
  }

  @Get('/account')
  @ApiOperation({ summary: 'Retrieve the authenticated account' })
  async getAuthedAcccount() {
    return this.getAuthedAccountService.getAccount();
  }
}
