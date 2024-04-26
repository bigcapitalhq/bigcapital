import { Service, Inject, Container } from 'typedi';
import {
  IRegisterDTO,
  ISystemUser,
  IPasswordReset,
  IAuthGetMetaPOJO,
} from '@/interfaces';
import { AuthSigninService } from './AuthSignin';
import { AuthSignupService } from './AuthSignup';
import { AuthSendResetPassword } from './AuthSendResetPassword';
import { GetAuthMeta } from './GetAuthMeta';
import { AuthSignupConfirmService } from './AuthSignupConfirm';
import { SystemUser } from '@/system/models';

interface ISignupConfirmDTO {
  token: string;
  email: string;
}

@Service()
export default class AuthenticationApplication {
  @Inject()
  private authSigninService: AuthSigninService;

  @Inject()
  private authSignupService: AuthSignupService;

  @Inject()
  private authSignupConfirmService: AuthSignupConfirmService;

  @Inject()
  private authResetPasswordService: AuthSendResetPassword;

  @Inject()
  private authGetMeta: GetAuthMeta;

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
   * Verfying the provided user's email after signin-up.
   * @param {string} email
   * @param {string} token
   * @returns {Promise<SystemUser>}
   */
  public async signUpConfirm(
    email: string,
    token: string
  ): Promise<SystemUser> {
    return this.authSignupConfirmService.signUpConfirm(email, token);
  }

  /**
   *
   * @param {string} email
   * @param {string} token
   * @returns
   */
  public async signUpConfirmSend(email: string, token: string) {
    return this.authSignupConfirmService.signUpConfirm(email, token);
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

  /**
   * Retrieves the authentication meta for SPA.
   * @returns {Promise<IAuthGetMetaPOJO>}
   */
  public async getAuthMeta(): Promise<IAuthGetMetaPOJO> {
    return this.authGetMeta.getAuthMeta();
  }
}
