import { Service, Inject, Container } from 'typedi';
import { IRegisterDTO, ISystemUser, IPasswordReset } from '@/interfaces';
import { AuthSigninService } from './AuthSignin';
import { AuthSignupService } from './AuthSignup';
import { AuthSendResetPassword } from './AuthSendResetPassword';

@Service()
export default class AuthenticationApplication {
  @Inject()
  private authSigninService: AuthSigninService;

  @Inject()
  private authSignupService: AuthSignupService;

  @Inject()
  private authResetPasswordService: AuthSendResetPassword;

  /**
   * Signin and generates JWT token.
   * @throws {ServiceError}
   * @param {string} email - Email address.
   * @param {string} password - Password.
   * @return {Promise<{user: IUser, token: string}>}
   */
  public async signIn(email: string, password: string) {
    return this.authSigninService.signIn(email, password);
  }

  /**
   * Signup a new user.
   * @param {IRegisterDTO} signupDTO
   * @returns {Promise<ISystemUser>}
   */
  public async signUp(signupDTO: IRegisterDTO): Promise<ISystemUser> {
    return this.authSignupService.signUp(signupDTO);
  }

  /**
   * Generates and retrieve password reset token for the given user email.
   * @param {string} email
   * @return {<Promise<IPasswordReset>}
   */
  public async sendResetPassword(email: string): Promise<IPasswordReset> {
    return this.authResetPasswordService.sendResetPassword(email);
  }

  /**
   * Resets a user password from given token.
   * @param {string} token - Password reset token.
   * @param {string} password - New Password.
   * @return {Promise<void>}
   */
  public async resetPassword(token: string, password: string): Promise<void> {
    return this.authResetPasswordService.resetPassword(token, password);
  }
}
