import {
  ITenantUserInactivatedPayload,
  ITenantUserActivatedPayload,
  ITenantUserDeletedPayload,
  ITenantUserEditedPayload,
} from '../Users.types';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { events } from '@/common/events/events';
import { purgeUserAbility } from '@/modules/Roles/TenantAbilities';

@Injectable()
export class PurgeUserAbilityCacheSubscriber {
  constructor(private readonly clsService: ClsService) {}

  /**
   * Purges authorized user ability once the user mutate.
   */
  @OnEvent(events.tenantUser.onEdited)
  @OnEvent(events.tenantUser.onActivated)
  @OnEvent(events.tenantUser.onInactivated)
  purgeAuthorizedUserAbility({
    tenantUser,
  }:
    | ITenantUserInactivatedPayload
    | ITenantUserActivatedPayload
    | ITenantUserDeletedPayload
    | ITenantUserEditedPayload) {
    const organizationId = this.clsService.get<string>('organizationId');

    if (organizationId == null || tenantUser.systemUserId == null) {
      return;
    }
    purgeUserAbility(organizationId, tenantUser.systemUserId);
  }
}
