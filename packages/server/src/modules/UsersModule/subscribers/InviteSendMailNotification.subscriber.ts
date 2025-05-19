import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IUserInviteTenantSyncedEventPayload } from '../Users.types';

@Injectable()
export default class InviteSendMainNotificationSubscribe {
  /**
   * Sends mail notification.
   * @param {IUserInvitedEventPayload} payload
   */
  @OnEvent(events.inviteUser.sendInviteTenantSynced)
  private sendMailNotification(
    payload: IUserInviteTenantSyncedEventPayload
  ) {
    const { invite, authorizedUser, tenantId } = payload;

    this.agenda.now('user-invite-mail', {
      invite,
      authorizedUser,
      tenantId,
    });
  };
}