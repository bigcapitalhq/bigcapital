import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';
import InviteUserService from 'services/InviteUsers';

@EventSubscriber()
export class InviteUserSubscriber {

  /**
   * 
   */
  @On(events.inviteUser.sendInvite)
  public onSendInvite(payload) {
    const { invite, authorizedUser, tenantId } = payload;
    const agenda = Container.get('agenda');

    agenda.now('user-invite-mail', {
      invite, authorizedUser, tenantId
    });
  }
}
