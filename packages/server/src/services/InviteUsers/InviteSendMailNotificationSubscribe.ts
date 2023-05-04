import { IUserInviteTenantSyncedEventPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';

@Service()
export default class InviteSendMainNotificationSubscribe {
  @Inject('agenda')
  private agenda: any;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.inviteUser.sendInviteTenantSynced,
      this.sendMailNotification
    );
  }

  /**
   * Sends mail notification.
   * @param {IUserInvitedEventPayload} payload
   */
  private sendMailNotification = (
    payload: IUserInviteTenantSyncedEventPayload
  ) => {
    const { invite, authorizedUser, tenantId } = payload;

    this.agenda.now('user-invite-mail', {
      invite,
      authorizedUser,
      tenantId,
    });
  };
}
