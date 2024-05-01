import { Service, Inject, Container } from 'typedi';
import {
  IRegisterDTO,
  ISystemUser,
  IPasswordReset,
  IAuthGetMetaPOJO,
  ITenant,
} from '@/interfaces';
import { AuthSigninService } from './AuthSignin';
import { AuthSignupService } from './AuthSignup';
import { AuthSendResetPassword } from './AuthSendResetPassword';
import { GetAuthMeta } from './GetAuthMeta';
import { GetAuthMe } from './GetAuthMe';

@Service()
export default class AuthenticationApplication {
  @Inject()
  private authSigninService: AuthSigninService;

  @Inject()
  private authSignupService: AuthSignupService;

  @Inject()
  private authResetPasswordService: AuthSendResetPassword;

  @Inject()
  private authGetMeta: GetAuthMeta;

  @Inject()
  private authGetMe: GetAuthMe;

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

  /**
   * Retrieves the authentication meta for SPA.
   * @returns {Promise<IAuthGetMetaPOJO>}
   */
  public async getAuthMeta(): Promise<IAuthGetMetaPOJO> {
    return this.authGetMeta.getAuthMeta();
  }

  /**
   * Retrieves the authenticated tenant
   * @param {number} tenantId
   * @returns {Promise<ITenant>}
   */
  public async getAuthTenant(tenantId: number): Promise<ITenant> {
    return this.authGetMe.getAuthTenant(tenantId);
  }
}
