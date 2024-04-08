import { IAcceptInviteEventPayload } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import { omit } from 'lodash';
import moment from 'moment';
import { Inject, Service } from 'typedi';

@Service()
export default class SyncTenantAcceptInvite {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(events.inviteUser.acceptInvite, this.syncTenantAcceptInvite);
  }

  /**
   * Syncs accept invite to tenant user.
   * @param {IAcceptInviteEventPayload} payload -
   */
  private syncTenantAcceptInvite = async ({ inviteToken, user, inviteUserDTO }: IAcceptInviteEventPayload) => {
    const { User } = this.tenancy.models(inviteToken.tenantId);

    await User.query()
      .where('systemUserId', inviteToken.userId)
      .update({
        ...omit(inviteUserDTO, ['password']),
        inviteAcceptedAt: moment().format('YYYY-MM-DD'),
      });
  };
}
