import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { IAcceptInviteEventPayload } from '../Users.types';

@Injectable()
export class CreateUserTenantOnAcceptInviteSubscriber {
  constructor(
    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,
  ) {}

  /**
   * Creates the `user_tenants` membership row once an invited user accepts
   * their invite. Sign-up already creates this row for the org owner
   * (`CreateUserTenantOnSignupSubscriber`), but invite-accept never did,
   * leaving invited users with `users.tenant_id` set and no membership row
   * — `AuthSigninService.resolveSigninTenant` can then never resolve a
   * workspace for them, so login fails with "No active workspace
   * available" even though the password is correct (#811).
   * @param {IAcceptInviteEventPayload} payload
   */
  @OnEvent(events.inviteUser.acceptInvite)
  async createUserTenantOnAcceptInvite({
    inviteToken,
  }: IAcceptInviteEventPayload) {
    const existingMembership = await this.userTenantModel.query().findOne({
      userId: inviteToken.userId,
      tenantId: inviteToken.tenantId,
    });

    if (!existingMembership) {
      await this.userTenantModel.query().insert({
        userId: inviteToken.userId,
        tenantId: inviteToken.tenantId,
        role: 'member',
      });
    }
  }
}
