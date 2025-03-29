import { Body, Controller, Post, Request } from '@nestjs/common';
import { PublicRoute } from './Jwt.guard';
import { AuthenticationApplication } from './AuthApplication.sevice';
import { AuthSignupDto } from './dtos/AuthSignup.dto';
import { AuthSigninDto } from './dtos/AuthSignin.dto';

@Controller('/auth')
@PublicRoute()
export class AuthController {
  constructor(private readonly authApp: AuthenticationApplication) {}
  @Post('/signin')
  signin(@Request() req: Request, @Body() signinDto: AuthSigninDto) {
    return this.authApp.signIn(signinDto);
  }

  @Post('/signup')
  signup(@Request() req: Request, @Body() signupDto: AuthSignupDto) {
    this.authApp.signUp(signupDto);
  }

  @Post('/signup/confirm')
  signupConfirm(@Body('email') email: string, @Body('token') token: string) {
    return this.authApp.signUpConfirm(email, token);
  }
}
