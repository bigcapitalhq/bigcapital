import { Service, Inject } from 'typedi';
import uniqid from 'uniqid';
import moment from 'moment';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import { ServiceError } from 'exceptions';
import { Invite, Tenant } from 'system/models';
import { Option } from 'models';
import { hashPassword } from 'utils';
import TenancyService from 'services/Tenancy/TenancyService';
import InviteUsersMailMessages from 'services/InviteUsers/InviteUsersMailMessages';
import events from 'subscribers/events';
import { ISystemUser, IInviteUserInput } from 'interfaces';

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
    const updateUserOper = systemUserRepository.update({
      ...inviteUserInput,
      active: 1,
      inviteAcceptedAt: moment().format('YYYY-MM-DD'),
      password: hashedPassword,
    }, { id: user.id });

    this.logger.info('[accept_invite] trying to delete the given token.');
    const deleteInviteTokenOper = Invite.query()
      .where('token', inviteToken.token)
      .delete();

    // Await all async operations.
    const [updatedUser] = await Promise.all([
      updateUserOper,
      deleteInviteTokenOper,
    ]);
    // Triggers `onUserAcceptInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.acceptInvite, {
      inviteToken,
      user: updatedUser,
    });
  }

  /**
   * Sends invite mail to the given email from the given tenant and user.
   * @param {number} tenantId -
   * @param {string} email -
   * @param {IUser} authorizedUser -
   *
   * @return {Promise<IInvite>}
   */
  public async sendInvite(
    tenantId: number,
    email: string,
    authorizedUser: ISystemUser
  ): Promise<{
    invite: IInvite,
    user: ISystemUser
  }> {
    const { systemUserRepository } = this.sysRepositories;

    // Throw error in case user email exists.
    await this.throwErrorIfUserEmailExists(email);

    this.logger.info('[send_invite] trying to store invite token.');
    const invite = await Invite.query().insert({
      email,
      tenant_id: authorizedUser.tenantId,
      token: uniqid(),
    });

    this.logger.info(
      '[send_invite] trying to store user with email and tenant.'
    );
    const user = await systemUserRepository.create({
      email,
      tenant_id: authorizedUser.tenantId,
      active: 1,
    });
    // Triggers `onUserSendInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.sendInvite, {
      invite, authorizedUser, tenantId
    });
    return { invite, user };
  }

  /**
   * Validate the given invite token.
   * @param {string} token - the given token string.
   * @throws {ServiceError}
   */
  public async checkInvite(
    token: string
  ): Promise<{ inviteToken: string; orgName: object }> {
    const inviteToken = await this.getInviteOrThrowError(token);

    // Find the tenant that associated to the given token.
    const tenant = await Tenant.query().findOne('id', inviteToken.tenantId);

    const tenantDb = this.tenantsManager.knexInstance(tenant.organizationId);

    const orgName = await Option.bindKnex(tenantDb)
      .query()
      .findOne('key', 'organization_name');

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
  ): Promise<ISystemUser> {
    const { systemUserRepository } = this.sysRepositories;
    const foundUser = await systemUserRepository.findOneByEmail(email);

    if (foundUser) {
      throw new ServiceError('email_already_invited');
    }
    return foundUser;
  }

  /**
   * Retrieve invite model from the given token or throw error.
   * @param {string} token - Then given token string.
   * @throws {ServiceError}
   * @returns {Invite}
   */
  private async getInviteOrThrowError(token: string) {
    const inviteToken = await Invite.query().findOne('token', token);

    if (!inviteToken) {
      this.logger.info('[aceept_invite] the invite token is invalid.');
      throw new ServiceError('invite_token_invalid');
    }
    return inviteToken;
  }

  /**
   * Validate the given user email and phone number uniquine.
   * @param {IInviteUserInput} inviteUserInput
   */
  private async validateUserPhoneNumber(
    inviteUserInput: IInviteUserInput
  ): Promise<ISystemUser> {
    const { systemUserRepository } = this.sysRepositories;
    const foundUser = await systemUserRepository.findOneByPhoneNumber(
      inviteUserInput.phoneNumber
    );

    if (foundUser) {
      throw new ServiceError('phone_number_exists');
    }
  }
}
