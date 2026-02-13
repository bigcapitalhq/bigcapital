import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IUserInviteTenantSyncedEventPayload,
  SendInviteUserMailJobPayload,
} from '../Users.types';
import {
  SendInviteUserMailJob,
  SendInviteUserMailQueue,
} from '../Users.constants';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export default class InviteSendMainNotificationSubscribe {
  constructor(
    @InjectQueue(SendInviteUserMailQueue)
    private readonly sendInviteMailQueue: Queue,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Sends mail notification.
   * @param {IUserInvitedEventPayload} payload
   */
  @OnEvent(events.inviteUser.sendInviteTenantSynced)
  async sendMailNotification({
    invite,
    user,
    invitingUser,
  }: IUserInviteTenantSyncedEventPayload) {
    const tenant = await this.tenancyContext.getTenant();
    const authedUser = await this.tenancyContext.getSystemUser();

    const organizationId = tenant.organizationId;
    const userId = authedUser.id;

    this.sendInviteMailQueue.add(SendInviteUserMailJob, {
      fromUser: invitingUser,
      invite,
      userId,
      organizationId,
    } as SendInviteUserMailJobPayload);
  }
}
