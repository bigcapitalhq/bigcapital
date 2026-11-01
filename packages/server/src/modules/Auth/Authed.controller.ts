import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { GetAuthenticatedAccount } from './queries/GetAuthedAccount.service';
import { Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TenantAgnosticRoute } from '../Tenancy/TenancyGlobal.guard';
import { AuthenticationApplication } from './AuthApplication.sevice';
import { IgnoreUserVerifiedRoute } from './guards/EnsureUserVerified.guard';
import { AuthedAccountResponseDto } from './dtos/AuthedAccountResponse.dto';

@Controller('/auth')
@ApiTags('Auth')
@ApiExtraModels(AuthedAccountResponseDto)
@TenantAgnosticRoute()
@IgnoreUserVerifiedRoute()
@Throttle({ auth: {} })
export class AuthedController {
  constructor(
    private readonly getAuthedAccountService: GetAuthenticatedAccount,
    private readonly authApp: AuthenticationApplication,
  ) {}

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
  @ApiResponse({
    status: 200,
    description: 'The authenticated account.',
    schema: { $ref: getSchemaPath(AuthedAccountResponseDto) },
  })
  async getAuthedAcccount() {
    return this.getAuthedAccountService.getAccount();
  }
}
