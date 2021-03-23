import { Service, Inject } from 'typedi';
import uniqid from 'uniqid';
import moment from 'moment';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import { ServiceError } from 'exceptions';
import { Invite, Tenant } from 'system/models';
import { Setting } from 'models';
import { hashPassword } from 'utils';
import TenancyService from 'services/Tenancy/TenancyService';
import InviteUsersMailMessages from 'services/InviteUsers/InviteUsersMailMessages';
import events from 'subscribers/events';
import {
  ISystemUser,
  IInviteUserInput,
  IUserInvite,
  IInviteUserService,
} from 'interfaces';
import TenantsManagerService from 'services/Tenancy/TenantsManager';
import { ERRORS } from './constants';

@Service()
export default class InviteUserService implements IInviteUserService {
  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  mailMessages: InviteUsersMailMessages;

  @Inject('repositories')
  sysRepositories: any;

  @Inject()
  tenantsManager: TenantsManagerService;

  /**
   * Sends invite mail to the given email from the given tenant and user.
   * @param {number} tenantId -
   * @param {string} email -
   * @param {IUser} authorizedUser -
   *
   * @return {Promise<IUserInvite>}
   */
  public async sendInvite(
    tenantId: number,
    email: string,
    authorizedUser: ISystemUser
  ): Promise<{
    invite: IUserInvite;
  }> {
    const { systemUserRepository } = this.sysRepositories;

    // Validates the given email not exists on the storage.
    await this.validateUserEmailNotExists(email);

    this.logger.info('[invite] trying to store user with email and tenant.', {
      email,
    });
    const user = await systemUserRepository.create({
      email,
      tenantId,
      active: 1,
    });

    this.logger.info('[invite] trying to store invite token.', { email });
    const invite = await Invite.query().insert({
      email,
      tenantId: authorizedUser.tenantId,
      userId: user.id,
      token: uniqid(),
    });

    // Triggers `onUserSendInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.sendInvite, {
      invite,
      authorizedUser,
      tenantId,
      user,
    });
    return { invite };
  }

  /**
   * Accept the received invite.
   * @param {string} token
   * @param {IInviteUserInput} inviteUserInput
   * @throws {ServiceErrors}
   * @returns {Promise<void>}
   */
  public async acceptInvite(
    token: string,
    inviteUserInput: IInviteUserInput
  ): Promise<void> {
    const { systemUserRepository } = this.sysRepositories;

    // Retrieve the invite token or throw not found error.
    const inviteToken = await this.getInviteTokenOrThrowError(token);

    // Validates the user phone number.
    await this.validateUserPhoneNumberNotExists(inviteUserInput.phoneNumber);

    this.logger.info('[invite] trying to hash the user password.');
    const hashedPassword = await hashPassword(inviteUserInput.password);

    this.logger.info('[invite] trying to update user details.');
    const user = await systemUserRepository.findOneByEmail(inviteToken.email);

    // Sets the invited user details after invite accepting.
    const systemUser = await systemUserRepository.update(
      {
        ...inviteUserInput,
        inviteAcceptedAt: moment().format('YYYY-MM-DD'),
        password: hashedPassword,
      },
      { id: inviteToken.userId }
    );
    // Clear invite token by the given user id.
    await this.clearInviteTokensByUserId(inviteToken.userId);

    // Triggers `onUserAcceptInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.acceptInvite, {
      inviteToken,
      user: systemUser,
    });
  }

  /**
   * Re-send user invite.
   * @param tenantId
   * @param {string} email
   * @return {Promise<{ invite: IUserInvite }>}
   */
  public async resendInvite(
    tenantId: number,
    userId: number,
    authorizedUser: ISystemUser
  ): Promise<{
    invite: IUserInvite;
  }> {
    // Retrieve the user by id or throw not found service error.
    const user = this.getUserByIdOrThrowError(userId);

    // Validate invite user active
    await this.validateInviteUserNotActive(tenantId, userId);

    // Clear all invite tokens of the given user id.
    await this.clearInviteTokensByUserId(userId);

    this.logger.info('[invite] trying to store invite token.', {
      userId,
      tenantId,
    });
    const invite = await Invite.query().insert({
      email: user.email,
      tenantId,
      userId,
      token: uniqid(),
    });
    // Triggers `onUserSendInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.sendInvite, {
      invite,
      authorizedUser,
      tenantId,
      user,
    });
    return { invite };
  }

  /**
   * Validate the given invite token.
   * @param {string} token - the given token string.
   * @throws {ServiceError}
   */
  public async checkInvite(
    token: string
  ): Promise<{ inviteToken: IUserInvite; orgName: object }> {
    const inviteToken = await this.getInviteTokenOrThrowError(token);

    // Find the tenant that associated to the given token.
    const tenant = await Tenant.query().findById(inviteToken.tenantId);

    // Setup the knex instance.
    this.tenantsManager.setupKnexInstance(tenant);

    // Retrieve the knex instance of the given tenant.
    const tenantKnexInstance = this.tenantsManager.getKnexInstance(tenant.id);

    const orgName = await Setting.bindKnex(tenantKnexInstance)
      .query()
      .findOne({ key: 'name', group: 'organization' });

    // Triggers `onUserCheckInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.checkInvite, {
      inviteToken,
      orgName,
    });
    return { inviteToken, orgName };
  }

  /**
   * Validate the given user has no active invite token.
   * @param {number} tenantId
   * @param {number} userId - User id.
   */
  private async validateInviteUserNotActive(tenantId: number, userId: number) {
    // Retrieve the invite token or throw not found error.
    const inviteTokens = await Invite.query()
      .modify('notExpired')
      .where('user_id', userId);

    // Throw the error if the one invite tokens is still active.
    if (inviteTokens.length > 0) {
      this.logger.info('[invite] email is already invited.', {
        userId,
        tenantId,
      });
      throw new ServiceError(ERRORS.USER_RECENTLY_INVITED);
    }
  }

  /**
   * Retrieve the given user by id or throw not found service error.
   * @param {number} userId - User id.
   */
  private async getUserByIdOrThrowError(userId: number) {
    const { systemUserRepository } = this.sysRepositories;
    const user = await systemUserRepository.findOneById(userId);

    // Throw if the user not found.
    if (!user) {
      throw new ServiceError(ERRORS.USER_NOT_FOUND);
    }
    return user;
  }

  /**
   * Throws error in case the given user email not exists on the storage.
   * @param {string} email
   * @throws {ServiceError}
   */
  private async validateUserEmailNotExists(email: string): Promise<void> {
    const { systemUserRepository } = this.sysRepositories;
    const foundUser = await systemUserRepository.findOneByEmail(email);

    if (foundUser) {
      throw new ServiceError(ERRORS.EMAIL_EXISTS);
    }
  }

  /**
   * Retrieve invite model from the given token or throw error.
   * @param {string} token - Then given token string.
   * @throws {ServiceError}
   * @returns {Invite}
   */
  private async getInviteTokenOrThrowError(
    token: string
  ): Promise<IUserInvite> {
    const inviteToken = await Invite.query()
      .modify('notExpired')
      .findOne('token', token);

    if (!inviteToken) {
      this.logger.info('[invite] the invite token is invalid.');
      throw new ServiceError(ERRORS.INVITE_TOKEN_INVALID);
    }
    return inviteToken;
  }

  /**
   * Validate the given user email and phone number uniquine.
   * @param {IInviteUserInput} inviteUserInput
   */
  private async validateUserPhoneNumberNotExists(
    phoneNumber: string
  ): Promise<void> {
    const { systemUserRepository } = this.sysRepositories;
    const foundUser = await systemUserRepository.findOneByPhoneNumber(
      phoneNumber
    );
    if (foundUser) {
      throw new ServiceError(ERRORS.PHONE_NUMBER_EXISTS);
    }
  }

  /**
   * Clear invite tokens of the given user id.
   * @param {number} userId - User id.
   */
  private async clearInviteTokensByUserId(userId: number) {
    this.logger.info('[invite] trying to delete the given token.');
    await Invite.query().where('user_id', userId).delete();
  }
}
