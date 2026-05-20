import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IAuthSignedUpEventPayload } from '@/modules/Auth/Auth.interfaces';
import { UserTenant } from '@/modules/System/models/UserTenant.model';

@Injectable()
export class CreateUserTenantOnSignupSubscriber {
  constructor(
    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,
  ) {}

  /**
   * On user sign-up, create a user_tenants record linking the new user
   * to their new organization as the owner.
   */
  @OnEvent(events.auth.signUp)
  async handleSignUp({ user, tenant }: IAuthSignedUpEventPayload): Promise<void> {
    await this.userTenantModel.query().insert({
      userId: user.id,
      tenantId: tenant.id,
      role: 'owner',
    });
  }
}
