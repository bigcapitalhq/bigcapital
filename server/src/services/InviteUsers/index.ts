import { Service, Inject } from "typedi";
import uniqid from 'uniqid';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '@/decorators/eventDispatcher';
import { ServiceError, ServiceErrors } from "@/exceptions";
import { SystemUser, Invite } from "@/system/models";
import { hashPassword } from '@/utils';
import TenancyService from '@/services/Tenancy/TenancyService';
import TenantsManager from "@/system/TenantsManager";
import InviteUsersMailMessages from "@/services/InviteUsers/InviteUsersMailMessages";
import events from '@/subscribers/events';
import {
  ISystemUser,
  IInviteUserInput,
} from '@/interfaces';

@Service()
export default class InviteUserService {
  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  tenantsManager: TenantsManager;

  @Inject('logger')
  logger: any;

  @Inject()
  mailMessages: InviteUsersMailMessages;

  /**
   * Accept the received invite.
   * @param {string} token 
   * @param {IInviteUserInput} inviteUserInput 
   * @throws {ServiceErrors}
   * @returns {Promise<void>}
   */
  async acceptInvite(token: string, inviteUserInput: IInviteUserInput): Promise<void> {
    const inviteToken = await this.getInviteOrThrowError(token);
    await this.validateUserEmailAndPhone(inviteUserInput);

    this.logger.info('[aceept_invite] trying to hash the user password.');
    const hashedPassword = await hashPassword(inviteUserInput.password);

    const user = SystemUser.query()
      .where('email', inviteUserInput.email)
      .patch({
        ...inviteUserInput,
        active: 1,
        email: inviteToken.email,
        invite_accepted_at: moment().format('YYYY/MM/DD'),
        password: hashedPassword,
        tenant_id: inviteToken.tenantId,
      });

    const deleteInviteTokenOper = Invite.query().where('token', inviteToken.token).delete();

    await Promise.all([
      insertUserOper,
      deleteInviteTokenOper,
    ]);

    // Triggers `onUserAcceptInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.acceptInvite, {
      inviteToken, user,
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
  public async sendInvite(tenantId: number, email: string, authorizedUser: ISystemUser): Promise<IInvite> {
    const { Option } = this.tenancy.models(tenantId);
    await this.throwErrorIfUserEmailExists(email);
  
    const invite = await Invite.query().insert({
      email,
      tenant_id: authorizedUser.tenantId,
      token: uniqid(),
    });

    // Triggers `onUserSendInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.sendInvite, {
      invite,      
    });
    return { invite };
  }

  /**
   * Validate the given invite token.
   * @param {string} token - the given token string. 
   * @throws {ServiceError}
   */
  public async checkInvite(token: string) {
    const inviteToken = await this.getInviteOrThrowError(token)

    // Find the tenant that associated to the given token.
    const tenant = await Tenant.query().findOne('id', inviteToken.tenantId);

    const tenantDb = this.tenantsManager.knexInstance(tenant.organizationId);

    const organizationOptions = await Option.bindKnex(tenantDb).query()
      .where('key', 'organization_name');

    // Triggers `onUserCheckInvite` event.
    this.eventDispatcher.dispatch(events.inviteUser.checkInvite, {
      inviteToken, organizationOptions,
    });
    return { inviteToken, organizationOptions };
  }

  private async throwErrorIfUserEmailExists(email: string) {
    const foundUser = await SystemUser.query().findOne('email', email);

    if (foundUser) {
      throw new ServiceError('email_already_invited');
    }
  }

  /**
   * Retrieve invite model from the given token or throw error.
   * @param {string} token - Then given token string.
   * @throws {ServiceError}
   */
  private async getInviteOrThrowError(token: string) {
    const inviteToken = await Invite.query().findOne('token', token);

    if (!inviteToken) {
      this.logger.info('[aceept_invite] the invite token is invalid.');
      throw new ServiceError('invite_token_invalid');
    }
  }

  /**
   * Validate the given user email and phone number uniquine.
   * @param {IInviteUserInput} inviteUserInput 
   */
  private async validateUserEmailAndPhone(inviteUserInput: IInviteUserInput) {
    const foundUser = await SystemUser.query()
      .onBuild(query => {
        query.where('email', inviteUserInput.email);

        if (inviteUserInput.phoneNumber) {
          query.where('phone_number', inviteUserInput.phoneNumber);
        }
      });    
    const serviceErrors: ServiceError[] = [];

    if (foundUser && foundUser.email === inviteUserInput.email) {
      this.logger.info('[send_user_invite] the given email exists.');
      serviceErrors.push(new ServiceError('email_exists'));
    }
    if (foundUser && foundUser.phoneNumber === inviteUserInput.phoneNumber) {
      this.logger.info('[send_user_invite] the given phone number exists.');
      serviceErrors.push(new ServiceError('phone_number_exists'));
    }
    if (serviceErrors.length > 0) {
      throw new ServiceErrors(serviceErrors);
    }
  }

}