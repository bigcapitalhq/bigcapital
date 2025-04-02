// @ts-nocheck
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard, PublicRoute } from './guards/jwt.guard';
import { AuthenticationApplication } from './AuthApplication.sevice';
import { AuthSignupDto } from './dtos/AuthSignup.dto';
import { AuthSigninDto } from './dtos/AuthSignin.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthSigninService } from './commands/AuthSignin.service';

@ApiTags('Auth')
@Controller('/auth')
@PublicRoute()
export class AuthController {
  constructor(
    private readonly authApp: AuthenticationApplication,
    private readonly authSignin: AuthSigninService,
  ) {}

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: AuthSigninDto })
  signin(@Request() req: Request, @Body() signinDto: AuthSigninDto) {
    const { user } = req;
    return { access_token: this.authSignin.signToken(user) };
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
