import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiExcludeController,
} from '@nestjs/swagger';
import { PublicRoute } from './guards/jwt.guard';
import { AuthenticationApplication } from './AuthApplication.sevice';
import { AuthSignupDto } from './dtos/AuthSignup.dto';
import { AuthSigninDto } from './dtos/AuthSignin.dto';
import { LocalAuthGuard } from './guards/Local.guard';
import { AuthSigninService } from './commands/AuthSignin.service';
import { TenantModel } from '../System/models/TenantModel';
import { SystemUser } from '../System/models/SystemUser';

@Controller('/auth')
@ApiTags('Auth')
@ApiExcludeController()
@PublicRoute()
@Throttle({ auth: {} })
export class AuthController {
  constructor(
    private readonly authApp: AuthenticationApplication,
    private readonly authSignin: AuthSigninService,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
  ) { }

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: AuthSigninDto })
  async signin(
    @Request() req: Request & { user: SystemUser },
    @Body() signinDto: AuthSigninDto,
  ) {
    const { user } = req;
    const tenant = await this.tenantModel.query().findById(user.tenantId);

    return {
      accessToken: this.authSignin.signToken(user),
      organizationId: tenant.organizationId,
      tenantId: tenant.id,
      userId: user.id,
    };
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: AuthSignupDto })
  signup(@Request() req: Request, @Body() signupDto: AuthSignupDto) {
    return this.authApp.signUp(signupDto);
  }

  @Post('/signup/confirm')
  @ApiOperation({ summary: 'Confirm user signup' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        token: { type: 'string', example: 'confirmation-token' },
      },
    },
  })
  signupConfirm(@Body('email') email: string, @Body('token') token: string) {
    return this.authApp.signUpConfirm(email, token);
  }

  @Post('/send_reset_password')
  @ApiOperation({ summary: 'Send reset password email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  sendResetPassword(@Body('email') email: string) {
    return this.authApp.sendResetPassword(email);
  }

  @Post('/reset_password/:token')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiParam({ name: 'token', description: 'Reset password token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'new-password' },
      },
    },
  })
  resetPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authApp.resetPassword(token, password);
  }

  @Get('/meta')
  meta() {
    return this.authApp.getAuthMeta();
  }
}
