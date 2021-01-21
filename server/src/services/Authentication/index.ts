import { Service, Inject, Container } from 'typedi';
import JWT from 'jsonwebtoken';
import uniqid from 'uniqid';
import { omit, cloneDeep } from 'lodash';
import moment from 'moment';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import { PasswordReset } from 'system/models';
import {
  IRegisterDTO,
  ITenant,
  ISystemUser,
  IPasswordReset,
  IAuthenticationService,
} from 'interfaces';
import { hashPassword } from 'utils';
import { ServiceError, ServiceErrors } from 'exceptions';
import config from 'config';
import events from 'subscribers/events';
import AuthenticationMailMessages from 'services/Authentication/AuthenticationMailMessages';
import AuthenticationSMSMessages from 'services/Authentication/AuthenticationSMSMessages';
import TenantsManager from 'services/Tenancy/TenantsManager';

const ERRORS = {
  INVALID_DETAILS: 'INVALID_DETAILS',
  USER_INACTIVE: 'USER_INACTIVE',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  TOKEN_INVALID: 'TOKEN_INVALID',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  PHONE_NUMBER_EXISTS: 'PHONE_NUMBER_EXISTS',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
};
@Service()
export default class AuthenticationService implements IAuthenticationService {
  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  smsMessages: AuthenticationSMSMessages;

  @Inject()
  mailMessages: AuthenticationMailMessages;

  @Inject('repositories')
  sysRepositories: any;

  @Inject()
  tenantsManager: TenantsManager;

  /**
   * Signin and generates JWT token.
   * @throws  {ServiceError}
   * @param  {string} emailOrPhone - Email or phone number.
   * @param  {string} password - Password.
   * @return {Promise<{user: IUser, token: string}>}
   */
  public async signIn(
    emailOrPhone: string,
    password: string
  ): Promise<{
    user: ISystemUser;
    token: string;
    tenant: ITenant;
  }> {
    this.logger.info('[login] Someone trying to login.', {
      emailOrPhone,
      password,
    });
    const { systemUserRepository } = this.sysRepositories;
    const loginThrottler = Container.get('rateLimiter.login');

    // Finds the user of the given email or phone number.
    const user = await systemUserRepository.findByCrediential(emailOrPhone);

    if (!user) {
      // Hits the loging throttler to the given crediential.
      await loginThrottler.hit(emailOrPhone);

      this.logger.info('[login] invalid data');
      throw new ServiceError(ERRORS.INVALID_DETAILS);
    }

    this.logger.info('[login] check password validation.', {
      emailOrPhone,
      password,
    });
    if (!user.verifyPassword(password)) {
      // Hits the loging throttler to the given crediential.
      await loginThrottler.hit(emailOrPhone);

      throw new ServiceError(ERRORS.INVALID_DETAILS);
    }
    if (!user.active) {
      this.logger.info('[login] user inactive.', { userId: user.id });
      throw new ServiceError(ERRORS.USER_INACTIVE);
    }

    this.logger.info('[login] generating JWT token.', { userId: user.id });
    const token = this.generateToken(user);

    this.logger.info('[login] updating user last login at.', {
      userId: user.id,
    });
    await systemUserRepository.patchLastLoginAt(user.id);

    this.logger.info('[login] Logging success.', { user, token });

    // Triggers `onLogin` event.
    this.eventDispatcher.dispatch(events.auth.login, {
      emailOrPhone,
      password,
      user,
    });
    const tenant = await user.$relatedQuery('tenant');

    // Keep the user object immutable.
    const outputUser = cloneDeep(user);

    // Remove password property from user object.
    Reflect.deleteProperty(outputUser, 'password');

    return { user: outputUser, token, tenant };
  }

  /**
   * Validates email and phone number uniqiness on the storage.
   * @throws {ServiceErrors}
   * @param  {IRegisterDTO} registerDTO - Register data object.
   */
  private async validateEmailAndPhoneUniqiness(registerDTO: IRegisterDTO) {
    const { systemUserRepository } = this.sysRepositories;

    const isEmailExists = await systemUserRepository.findOneByEmail(
      registerDTO.email
    );
    const isPhoneExists = await systemUserRepository.findOneByPhoneNumber(
      registerDTO.phoneNumber
    );
    const errorReasons: ServiceError[] = [];

    if (isPhoneExists) {
      this.logger.info('[register] phone number exists on the storage.');
      errorReasons.push(new ServiceError(ERRORS.PHONE_NUMBER_EXISTS));
    }
    if (isEmailExists) {
      this.logger.info('[register] email exists on the storage.');
      errorReasons.push(new ServiceError(ERRORS.EMAIL_EXISTS));
    }
    if (errorReasons.length > 0) {
      throw new ServiceErrors(errorReasons);
    }
  }

  /**
   * Registers a new tenant with user from user input.
   * @throws {ServiceErrors}
   * @param {IUserDTO} user
   */
  public async register(registerDTO: IRegisterDTO): Promise<ISystemUser> {
    this.logger.info('[register] Someone trying to register.');
    await this.validateEmailAndPhoneUniqiness(registerDTO);

    this.logger.info('[register] Creating a new tenant organization.');
    const tenant = await this.newTenantOrganization();

    this.logger.info('[register] Trying hashing the password.');
    const hashedPassword = await hashPassword(registerDTO.password);

    const { systemUserRepository } = this.sysRepositories;
    const registeredUser = await systemUserRepository.create({
      ...omit(registerDTO, 'country'),
      active: true,
      password: hashedPassword,
      tenant_id: tenant.id,
    });
    // Triggers `onRegister` event.
    this.eventDispatcher.dispatch(events.auth.register, {
      registerDTO,
      tenant,
      user: registeredUser,
    });
    return registeredUser;
  }

  /**
   * Generates and insert new tenant organization id.
   * @async
   * @return {Promise<ITenant>}
   */
  private async newTenantOrganization(): Promise<ITenant> {
    return this.tenantsManager.createTenant();
  }

  /**
   * Validate the given email existance on the storage.
   * @throws {ServiceError}
   * @param  {string} email - email address.
   */
  private async validateEmailExistance(email: string): Promise<ISystemUser> {
    const { systemUserRepository } = this.sysRepositories;
    const userByEmail = await systemUserRepository.findOneByEmail(email);

    if (!userByEmail) {
      this.logger.info('[send_reset_password] The given email not found.');
      throw new ServiceError(ERRORS.EMAIL_NOT_FOUND);
    }
    return userByEmail;
  }

  /**
   * Generates and retrieve password reset token for the given user email.
   * @param {string} email
   * @return {<Promise<IPasswordReset>}
   */
  public async sendResetPassword(email: string): Promise<IPasswordReset> {
    this.logger.info('[send_reset_password] Trying to send reset password.');
    const user = await this.validateEmailExistance(email);

    // Delete all stored tokens of reset password that associate to the give email.
    this.logger.info(
      '[send_reset_password] trying to delete all tokens by email.'
    );
    this.deletePasswordResetToken(email);

    const token: string = uniqid();

    this.logger.info('[send_reset_password] insert the generated token.');
    const passwordReset = await PasswordReset.query().insert({ email, token });

    // Triggers `onSendResetPassword` event.
    this.eventDispatcher.dispatch(events.auth.sendResetPassword, {
      user,
      token,
    });
    return passwordReset;
  }

  /**
   * Resets a user password from given token.
   * @param {string} token - Password reset token.
   * @param {string} password - New Password.
   * @return {Promise<void>}
   */
  public async resetPassword(token: string, password: string): Promise<void> {
    const { systemUserRepository } = this.sysRepositories;

    // Finds the password reset token.
    const tokenModel: IPasswordReset = await PasswordReset.query().findOne(
      'token',
      token
    );
    // In case the password reset token not found throw token invalid error..
    if (!tokenModel) {
      this.logger.info('[reset_password] token invalid.');
      throw new ServiceError(ERRORS.TOKEN_INVALID);
    }
    // Different between tokne creation datetime and current time.
    if (
      moment().diff(tokenModel.createdAt, 'seconds') >
      config.resetPasswordSeconds
    ) {
      this.logger.info('[reset_password] token expired.');

      // Deletes the expired token by expired token email.
      await this.deletePasswordResetToken(tokenModel.email);
      throw new ServiceError(ERRORS.TOKEN_EXPIRED);
    }
    const user = await systemUserRepository.findOneByEmail(tokenModel.email);

    if (!user) {
      throw new ServiceError(ERRORS.USER_NOT_FOUND);
    }
    const hashedPassword = await hashPassword(password);

    this.logger.info('[reset_password] saving a new hashed password.');
    await systemUserRepository.update(
      { password: hashedPassword },
      { id: user.id }
    );

    // Deletes the used token.
    await this.deletePasswordResetToken(tokenModel.email);

    // Triggers `onResetPassword` event.
    this.eventDispatcher.dispatch(events.auth.resetPassword, {
      user,
      token,
      password,
    });
    this.logger.info('[reset_password] reset password success.');
  }

  /**
   * Deletes the password reset token by the given email.
   * @param  {string} email
   * @returns {Promise}
   */
  private async deletePasswordResetToken(email: string) {
    this.logger.info('[reset_password] trying to delete all tokens by email.');
    return PasswordReset.query().where('email', email).delete();
  }

  /**
   * Generates JWT token for the given user.
   * @param {ISystemUser} user
   * @return {string} token
   */
  generateToken(user: ISystemUser): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    this.logger.silly(`Sign JWT for userId: ${user.id}`);
    return JWT.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }
}
