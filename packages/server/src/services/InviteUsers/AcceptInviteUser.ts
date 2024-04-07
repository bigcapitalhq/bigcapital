import { ServiceError } from '@/exceptions';
import { IAcceptInviteEventPayload, ICheckInviteEventPayload, IInviteUserInput, IUserInvite } from '@/interfaces';
import { IAcceptInviteUserService } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { Invite, SystemUser, Tenant } from '@/system/models';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import { hashPassword } from '../../utils';
import { ERRORS } from './constants';

@Service()
export default class AcceptInviteUserService implements IAcceptInviteUserService {
  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Accept the received invite.
   * @param {string} token
   * @param {IInviteUserInput} inviteUserInput
   * @throws {ServiceErrors}
   * @returns {Promise<void>}
   */
  public async acceptInvite(token: string, inviteUserDTO: IInviteUserInput): Promise<void> {
    // Retrieve the invite token or throw not found error.
    const inviteToken = await this.getInviteTokenOrThrowError(token);

    // Hash the given password.
    const hashedPassword = await hashPassword(inviteUserDTO.password);

    // Retrieve the system user.
    const user = await SystemUser.query().findOne('email', inviteToken.email);

    // Sets the invited user details after invite accepting.
    const systemUser = await SystemUser.query().updateAndFetchById(inviteToken.userId, {
      ...inviteUserDTO,
      inviteAcceptedAt: moment().format('YYYY-MM-DD'),
      password: hashedPassword,
    });
    // Clear invite token by the given user id.
    await this.clearInviteTokensByUserId(inviteToken.userId);

    // Triggers `onUserAcceptInvite` event.
    await this.eventPublisher.emitAsync(events.inviteUser.acceptInvite, {
      inviteToken,
      user: systemUser,
      inviteUserDTO,
    } as IAcceptInviteEventPayload);
  }

  /**
   * Validate the given invite token.
   * @param {string} token - the given token string.
   * @throws {ServiceError}
   */
  public async checkInvite(token: string): Promise<{ inviteToken: IUserInvite; orgName: object }> {
    const inviteToken = await this.getInviteTokenOrThrowError(token);

    // Find the tenant that associated to the given token.
    const tenant = await Tenant.query().findById(inviteToken.tenantId).withGraphFetched('metadata');

    // Triggers `onUserCheckInvite` event.
    await this.eventPublisher.emitAsync(events.inviteUser.checkInvite, {
      inviteToken,
      tenant,
    } as ICheckInviteEventPayload);

    return { inviteToken, orgName: tenant.metadata.name };
  }

  /**
   * Retrieve invite model from the given token or throw error.
   * @param {string} token - Then given token string.
   * @throws {ServiceError}
   * @returns {Invite}
   */
  private getInviteTokenOrThrowError = async (token: string): Promise<IUserInvite> => {
    const inviteToken = await Invite.query().modify('notExpired').findOne('token', token);

    if (!inviteToken) {
      throw new ServiceError(ERRORS.INVITE_TOKEN_INVALID);
    }
    return inviteToken;
  };

  /**
   * Validate the given user email and phone number uniquine.
   * @param {IInviteUserInput} inviteUserInput
   */
  private validateUserPhoneNumberNotExists = async (phoneNumber: string): Promise<void> => {
    const foundUser = await SystemUser.query().findOne({ phoneNumber });

    if (foundUser) {
      throw new ServiceError(ERRORS.PHONE_NUMBER_EXISTS);
    }
  };

  /**
   * Clear invite tokens of the given user id.
   * @param {number} userId - User id.
   */
  private clearInviteTokensByUserId = async (userId: number) => {
    await Invite.query().where('user_id', userId).delete();
  };
}
