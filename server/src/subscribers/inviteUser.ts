import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';

@EventSubscriber()
export class InviteUserSubscriber {

  @On(events.inviteUser.acceptInvite)
  public onAcceptInvite(payload) {
    const { inviteToken, user } = payload;
    const agenda = Container.get('agenda');
    
  }

  @On(events.inviteUser.checkInvite)
  public onCheckInvite(payload) {
    const { inviteToken, organizationOptions } = payload;
    const agenda = Container.get('agenda');

  }

  @On(events.inviteUser.sendInvite)
  public onSendInvite(payload) {
    const { invite } = payload;
    const agenda = Container.get('agenda');

  }
}