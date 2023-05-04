import { Service, Inject } from 'typedi';
import uniqid from 'uniqid';
import moment from 'moment';
import { ServiceError } from '@/exceptions';
import TenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import {
  ISystemUser,
  IUserSendInviteDTO,
  IInviteUserService,
  ITenantUser,
  IUserInvitedEventPayload,
  IUserInviteResendEventPayload,
} from '@/interfaces';
import { ERRORS } from './constants';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import RolesService from '@/services/Roles/RolesService';

@Service()
export default class InviteTenantUserService implements IInviteUserService {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private rolesService: RolesService;

  /**
   * Sends invite mail to the given email from the given tenant and user.
   * @param {number} tenantId -
   * @param {string} email -
   * @param {IUser} authorizedUser -
   * @return {Promise<IUserInvite>}
   */
  public async sendInvite(
    tenantId: number,
    sendInviteDTO: IUserSendInviteDTO,
    authorizedUser: ISystemUser
  ): Promise<{
    invitedUser: ITenantUser;
  }> {
    const { User } = this.tenancy.models(tenantId);

    // Get the given role or throw not found service error.
    const role = await this.rolesService.getRoleOrThrowError(
      tenantId,
      sendInviteDTO.roleId
    );
    // Validates the given email not exists on the storage.
    await this.validateUserEmailNotExists(tenantId, sendInviteDTO.email);

    // Generates a new invite token.
    const inviteToken = uniqid();

    // Creates and fetches a tenant user.
    const user = await User.query().insertAndFetch({
      email: sendInviteDTO.email,
      roleId: sendInviteDTO.roleId,
      active: true,
      invitedAt: new Date(),
    });
    // Triggers `onUserSendInvite` event.
    await this.eventPublisher.emitAsync(events.inviteUser.sendInvite, {
      inviteToken,
      authorizedUser,
      tenantId,
      user,
    } as IUserInvitedEventPayload);

    return { invitedUser: user };
  }

  /**
   * Re-send user invite.
   * @param {number} tenantId -
   * @param {string} email -
   * @return {Promise<{ invite: IUserInvite }>}
   */
  public async resendInvite(
    tenantId: number,
    userId: number,
    authorizedUser: ISystemUser
  ): Promise<{ user: ITenantUser }> {
    // Retrieve the user by id or throw not found service error.
    const user = await this.getUserByIdOrThrowError(tenantId, userId);

    // Validate the user is not invited recently.
    this.validateUserInviteThrottle(user);

    // Validate the given user is not accepted yet.
    this.validateInviteUserNotAccept(user);

    // Generates a new invite token.
    const inviteToken = uniqid();

    // Triggers `onUserSendInvite` event.
    await this.eventPublisher.emitAsync(events.inviteUser.resendInvite, {
      authorizedUser,
      tenantId,
      user,
      inviteToken,
    } as IUserInviteResendEventPayload);

    return { user };
  }

  /**
   * Validate the given user has no active invite token.
   * @param {number} tenantId
   * @param {number} userId - User id.
   */
  private validateInviteUserNotAccept = (user: ITenantUser) => {
    // Throw the error if the one invite tokens is still active.
    if (user.inviteAcceptedAt) {
      throw new ServiceError(ERRORS.USER_RECENTLY_INVITED);
    }
  };

  /**
   * Validates user invite is not invited recently before specific time point.
   * @param {ITenantUser} user
   */
  private validateUserInviteThrottle = (user: ITenantUser) => {
    const PARSE_FORMAT = 'M/D/YYYY, H:mm:ss A';
    const beforeTime = moment().subtract(5, 'minutes');

    if (moment(user.invitedAt, PARSE_FORMAT).isAfter(beforeTime)) {
      throw new ServiceError(ERRORS.USER_RECENTLY_INVITED);
    }
  };

  /**
   * Retrieve the given user by id or throw not found service error.
   * @param {number} userId - User id.
   */
  private getUserByIdOrThrowError = async (
    tenantId: number,
    userId: number
  ): Promise<ITenantUser> => {
    const { User } = this.tenancy.models(tenantId);

    // Retrieve the tenant user.
    const user = await User.query().findById(userId);

    // Throw if the user not found.
    if (!user) {
      throw new ServiceError(ERRORS.USER_NOT_FOUND);
    }
    return user;
  };

  /**
   * Throws error in case the given user email not exists on the storage.
   * @param {string} email
   * @throws {ServiceError}
   */
  private async validateUserEmailNotExists(
    tenantId: number,
    email: string
  ): Promise<void> {
    const { User } = this.tenancy.models(tenantId);
    const foundUser = await User.query().findOne('email', email);

    if (foundUser) {
      throw new ServiceError(ERRORS.EMAIL_EXISTS);
    }
  }
}
