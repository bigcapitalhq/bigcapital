import { AuthForgetPasswordService } from './AuthForgetPassword.service';
import { AuthSendResetPasswordService } from './AuthResetPassword.service';
import { AuthSigninService } from './AuthSignin.service';
import { AuthSignupService } from './AuthSignup.service';

export class AuthApplication {
  constructor(
    private readonly authSigninService: AuthSigninService,
    private readonly authSignupService: AuthSignupService,
    private readonly authResetPasswordService: AuthSendResetPasswordService,
    private readonly authForgetPasswordService: AuthForgetPasswordService,
  ) {}

  async signin(email: string, password: string) {
    return this.authSigninService.signIn(email, password);
  }

  async signup(data: any) {
    return this.authSignupService.signup(data);
  }

  async resetPassword(data: any) {
    return this.authResetPasswordService.resetPassword(data);
  }

  async forgetPassword(data: any) {
    return this.authForgetPasswordService.execute(data);
  }
}
