import { Service, Inject, Container } from "typedi";
import JWT from 'jsonwebtoken';
import uniqid from 'uniqid';
import { omit } from 'lodash';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '@/decorators/eventDispatcher';
import {
  SystemUser,
  PasswordReset,
  Tenant,
} from '@/system/models';
import {
  IRegisterDTO,
  ITenant,
  ISystemUser,
  IPasswordReset,
} from '@/interfaces';
import TenantsManager from "@/system/TenantsManager";
import { hashPassword } from '@/utils';
import { ServiceError, ServiceErrors } from "@/exceptions";
import config from '@/../config/config';
import events from '@/subscribers/events';
import AuthenticationMailMessages from '@/services/Authentication/AuthenticationMailMessages';
import AuthenticationSMSMessages from '@/services/Authentication/AuthenticationSMSMessages';

@Service()
export default class AuthenticationService {
  @Inject('logger')
  logger: any;

  @Inject()
  tenantsManager: TenantsManager;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  smsMessages: AuthenticationSMSMessages;

  @Inject()
  mailMessages: AuthenticationMailMessages;

  /**
   * Signin and generates JWT token.
   * @throws  {ServiceError}
   * @param  {string} emailOrPhone - Email or phone number. 
   * @param  {string} password - Password.
   * @return {Promise<{user: IUser, token: string}>}
   */
  async signIn(emailOrPhone: string, password: string): Promise<{user: IUser, token: string }> {
    this.logger.info('[login] Someone trying to login.', { emailOrPhone, password });

    const user = await SystemUser.query()
      .where('email', emailOrPhone)
      .orWhere('phone_number', emailOrPhone)
      .withGraphFetched('tenant')
      .first();

    if (!user) {
      this.logger.info('[login] invalid data');
      throw new ServiceError('invalid_details');
    }

    this.logger.info('[login] check password validation.');
    if (!user.verifyPassword(password)) {
      throw new ServiceError('invalid_password');
    }

    if (!user.active) {
      this.logger.info('[login] user inactive.');
      throw new ServiceError('user_inactive');
    }

    this.logger.info('[login] generating JWT token.');
    const token = this.generateToken(user);

    this.logger.info('[login] Logging success.', { user, token });

    // Triggers `onLogin` event.
    this.eventDispatcher.dispatch(events.auth.login, {
      emailOrPhone, password,
    });
    return { user, token };
  }

  /**
   * Validates email and phone number uniqiness on the storage.
   * @throws {ServiceErrors}
   * @param  {IRegisterDTO} registerDTO - Register data object.
   */
  private async validateEmailAndPhoneUniqiness(registerDTO: IRegisterDTO) {
    const user: ISystemUser = await SystemUser.query()
      .where('email', registerDTO.email)
      .orWhere('phone_number', registerDTO.phoneNumber)
      .first();

    const errorReasons: ServiceErrors[] = [];

    if (user && user.phoneNumber === registerDTO.phoneNumber) {
      this.logger.info('[register] phone number exists on the storage.');
      errorReasons.push(new ServiceError('phone_number_exists'));
    }
    if (user && user.email === registerDTO.email) {
      this.logger.info('[register] email exists on the storage.');
      errorReasons.push(new ServiceError('email_exists'));
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
  async register(registerDTO: IRegisterDTO): Promise<ISystemUser> {
    this.logger.info('[register] Someone trying to register.');
    await this.validateEmailAndPhoneUniqiness(registerDTO);

    this.logger.info('[register] Creating a new tenant org.')
    const tenant = await this.newTenantOrganization();

    this.logger.info('[register] Trying hashing the password.')
    const hashedPassword = await hashPassword(registerDTO.password);

    const registeredUser = await SystemUser.query().insert({
      ...omit(registerDTO, 'country', 'organizationName'),
      active: true,
      password: hashedPassword,
      tenant_id: tenant.id,
    });

    // Triggers `onRegister` event.
    this.eventDispatcher.dispatch(events.auth.register, {
      registerDTO, user: registeredUser
    });
    return registeredUser;
  }

  /**
   * Generates and insert new tenant organization id.
   * @async
   * @return {Promise<ITenant>}
   */
  private async newTenantOrganization(): Promise<ITenant> {
    const organizationId = uniqid();
    const tenantOrganization = await Tenant.query().insert({
      organization_id: organizationId,
    });
    return tenantOrganization;
  }

  /**
   * Initialize tenant database.
   * @param {number} tenantId - The given tenant id.
   * @return {void}
   */
  async initializeTenant(tenantId: number): Promise<void> {
    const dbManager = Container.get('dbManager');

    const tenant = await Tenant.query().findById(tenantId);

    this.logger.info('[tenant_init] Tenant DB creating.', { tenant });
    await dbManager.createDb(`bigcapital_tenant_${tenant.organizationId}`);
    
    const tenantDb = this.tenantsManager.knexInstance(tenant.organizationId);

    this.logger.info('[tenant_init] Tenant DB migrating to latest version.', { tenant });
    await tenantDb.migrate.latest();
  }

  /**
   * Validate the given email existance on the storage.
   * @throws {ServiceError}
   * @param  {string} email - email address. 
   */
  private async validateEmailExistance(email: string) {
    const foundEmail = await SystemUser.query().findOne('email', email);

    if (!foundEmail) {
      this.logger.info('[send_reset_password] The given email not found.');  
      throw new ServiceError('email_not_found');
    }
  }

  /**
   * Generates and retrieve password reset token for the given user email.
   * @param {string} email 
   * @return {<Promise<IPasswordReset>}
   */
  async sendResetPassword(email: string): Promise<IPasswordReset> {
    this.logger.info('[send_reset_password] Trying to send reset password.');
    await this.validateEmailExistance(email);

    // Delete all stored tokens of reset password that associate to the give email.
    this.logger.info('[send_reset_password] trying to delete all tokens by email.');
    await PasswordReset.query().where('email', email).delete();

    const token = uniqid();

    this.logger.info('[send_reset_password] insert the generated token.');
    const passwordReset = await PasswordReset.query().insert({ email, token });
    const user = await SystemUser.query().findOne('email', email);

    // Triggers `onSendResetPassword` event.
    this.eventDispatcher.dispatch(events.auth.sendResetPassword, { user, token });

    return passwordReset;
  }

  /**
   * Resets a user password from given token.
   * @param {string} token - Password reset token.
   * @param {string} password - New Password.
   * @return {Promise<void>}
   */
  async resetPassword(token: string, password: string): Promise<void> {
    const tokenModel = await PasswordReset.query().findOne('token', token)

    if (!tokenModel) {
      this.logger.info('[reset_password] token invalid.');
      throw new ServiceError('token_invalid');
    }
    const user = await SystemUser.query().findOne('email', tokenModel.email)

    if (!user) {
      throw new ServiceError('user_not_found');
    }
    const hashedPassword = await hashPassword(password);

    this.logger.info('[reset_password] saving a new hashed password.');
    await SystemUser.query()
      .where('email', tokenModel.email)
      .update({
        password: hashedPassword,
      });
    // Delete the reset password token.
    await PasswordReset.query().where('email', user.email).delete();

    // Triggers `onResetPassword` event.
    this.eventDispatcher.dispatch(events.auth.resetPassword, { user, token, password });

    this.logger.info('[reset_password] reset password success.');
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
      config.jwtSecret,
    );
  }
}