import { pick } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { events } from '@/common/events/events';
import { IAcceptInviteEventPayload } from '../Users.types';

@Injectable()
export class SyncTenantAcceptInviteSubscriber {
  constructor(
    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
  ) {}

  /**
   * Syncs accept invite to tenant user.
   * @param {IAcceptInviteEventPayload} payload -
   */
  @OnEvent(events.inviteUser.acceptInvite)
  async syncTenantAcceptInvite({
    inviteToken,
    user,
  }: IAcceptInviteEventPayload) {
    await this.tenantUserModel()
      .query()
      .where('systemUserId', inviteToken.userId)
      .update({
        ...pick(user, ['firstName', 'lastName', 'email', 'active']),
        inviteAcceptedAt: new Date(),
      });
  }
}
