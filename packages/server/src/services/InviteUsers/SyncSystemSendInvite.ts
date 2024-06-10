import { Inject, Service } from 'typedi';
import {
  IUserInvitedEventPayload,
  IUserInviteResendEventPayload,
  IUserInviteTenantSyncedEventPayload,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { Invite, SystemUser } from '@/system/models';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export default class SyncSystemSendInvite {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(events.inviteUser.sendInvite, this.syncSendInviteSystem);
    bus.subscribe(
      events.inviteUser.resendInvite,
      this.syncResendInviteSystemUser
    );
  }

  /**
   * Syncs send invite to system user.
   * @param {IUserInvitedEventPayload} payload -
   */
  private syncSendInviteSystem = async ({
    inviteToken,
    user,
    tenantId,
    authorizedUser,
  }: IUserInvitedEventPayload) => {
    const { User } = this.tenancy.models(tenantId);

    // Creates a new system user.
    const systemUser = await SystemUser.query().insert({
      email: user.email,
      active: user.active,
      tenantId,

      // Email should be verified since the user got the invite token through email.
      verified: true,
    });
    // Creates a invite user token.
    const invite = await Invite.query().insert({
      email: user.email,
      tenantId,
      userId: systemUser.id,
      token: inviteToken,
    });
    // Links the tenant user with created system user.
    await User.query().findById(user.id).patch({
      systemUserId: systemUser.id,
    });
    // Triggers `onUserSendInviteTenantSynced` event.
    await this.eventPublisher.emitAsync(
      events.inviteUser.sendInviteTenantSynced,
      {
        invite,
        tenantId,
        user,
        authorizedUser,
      } as IUserInviteTenantSyncedEventPayload
    );
  };

  /**
   * Syncs resend invite to system user.
   * @param {IUserInviteResendEventPayload} payload -
   */
  private syncResendInviteSystemUser = async ({
    inviteToken,
    authorizedUser,
    tenantId,
    user,
  }: IUserInviteResendEventPayload) => {
    // Clear all invite tokens of the given user id.
    await this.clearInviteTokensByUserId(user.systemUserId, tenantId);

    const invite = await Invite.query().insert({
      email: user.email,
      tenantId,
      userId: user.systemUserId,
      token: inviteToken,
    });
  };

  /**
   * Clear invite tokens of the given user id.
   * @param {number} userId - User id.
   */
  private clearInviteTokensByUserId = async (
    userId: number,
    tenantId: number
  ) => {
    await Invite.query()
      .where({
        userId,
        tenantId,
      })
      .delete();
  };
}
