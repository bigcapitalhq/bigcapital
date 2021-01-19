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
import { ISystemUser, IInviteUserInput, IUserInvite } from 'interfaces';
import TenantsManagerService from 'services/Tenancy/TenantsManager';

const ERRORS = {
  EMAIL_ALREADY_INVITED: 'EMAIL_ALREADY_INVITED',
  INVITE_TOKEN_INVALID: 'INVITE_TOKEN_INVALID',
  PHONE_NUMBER_EXISTS: 'PHONE_NUMBER_EXISTS',
  EMAIL_EXISTS: 'EMAIL_EXISTS'
};
@Service()
export default class InviteUserService {
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
   * Accept the received invite.
   * @param {string} token
   * @param {IInviteUserInput} inviteUserInput
   * @throws {ServiceErrors}
   * @returns {Promise<void>}
   */
  async acceptInvite(
    token: string,
    inviteUserInput: IInviteUserInput
  ): Promise<void> {
    const { systemUserRepository } = this.sysRepositories;

    // Retrieve the invite token or throw not found error.
    const inviteToken = await this.getInviteOrThrowError(token);

    // Validates the user phone number.
    await this.validateUserPhoneNumber(inviteUserInput);

    this.logger.info('[aceept_invite] trying to hash the user password.');
    const hashedPassword = await hashPassword(inviteUserInput.password);

    this.logger.info('[accept_invite] trying to update user details.');
    const user = await systemUserRepository.findOneByEmail(inviteToken.email);

    // Sets the invited user details after invite accepting.
    const systemUserOper = systemUserRepository.create(
      {
        ...inviteUserInput,
        email: inviteToken.email,
        tenantId: inviteToken.tenantId,
        active: 1,
        inviteAcceptedAt: moment().format('YYYY-MM-DD'),
        password: hashedPassword,
      },
    );

    this.logger.info('[accept_invite] trying to delete the given token.');
    const deleteInviteTokenOper = Invite.query()
      .where('token', inviteToken.token)
      .delete();

    // Await all async operations.
    const [systemUser] = await Promise.all([
      systemUserOper,
      deleteInviteTokenOper,
    ]);
    // Triggers `onUserAcceptInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.acceptInvite, {
      inviteToken,
      user: systemUser,
    });
  }

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
    // Throw error in case user email exists.
    await this.throwErrorIfUserEmailExists(email);

    // Throws service error in case the user already invited.
    await this.throwErrorIfUserInvited(email);

    this.logger.info('[send_invite] trying to store invite token.');
    const invite = await Invite.query().insert({
      email,
      tenant_id: authorizedUser.tenantId,
      token: uniqid(),
    });

    this.logger.info(
      '[send_invite] trying to store user with email and tenant.'
    );
    // Triggers `onUserSendInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.sendInvite, {
      invite,
      authorizedUser,
      tenantId,
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
    const inviteToken = await this.getInviteOrThrowError(token);

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
   * Throws error in case the given user email not exists on the storage.
   * @param {string} email
   */
  private async throwErrorIfUserEmailExists(
    email: string
  ): Promise<void> {
    const { systemUserRepository } = this.sysRepositories;
    const foundUser = await systemUserRepository.findOneByEmail(email);

    if (foundUser) {
      throw new ServiceError(ERRORS.EMAIL_EXISTS);
    }
  }

  /**
   * Throws service error if the user already invited.
   * @param {string} email -  
   */
  private async throwErrorIfUserInvited(
    email: string,
  ): Promise<void> {
    const inviteToken = await Invite.query().findOne('email', email);

    if (inviteToken) {
      throw new ServiceError(ERRORS.EMAIL_ALREADY_INVITED);
    }
  }

  /**
   * Retrieve invite model from the given token or throw error.
   * @param {string} token - Then given token string.
   * @throws {ServiceError}
   * @returns {Invite}
   */
  private async getInviteOrThrowError(token: string): Promise<IUserInvite> {
    const inviteToken = await Invite.query().findOne('token', token);

    if (!inviteToken) {
      this.logger.info('[aceept_invite] the invite token is invalid.');
      throw new ServiceError(ERRORS.INVITE_TOKEN_INVALID);
    }
    return inviteToken;
  }

  /**
   * Validate the given user email and phone number uniquine.
   * @param {IInviteUserInput} inviteUserInput
   */
  private async validateUserPhoneNumber(
    inviteUserInput: IInviteUserInput
  ): Promise<void> {
    const { systemUserRepository } = this.sysRepositories;
    const foundUser = await systemUserRepository.findOneByPhoneNumber(
      inviteUserInput.phoneNumber
    );
    if (foundUser) {
      throw new ServiceError(ERRORS.PHONE_NUMBER_EXISTS);
    }
  }
}
