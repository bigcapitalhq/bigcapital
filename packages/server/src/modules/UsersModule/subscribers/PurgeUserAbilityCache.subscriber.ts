import {
  ITenantUserInactivatedPayload,
  ITenantUserActivatedPayload,
  ITenantUserDeletedPayload,
  ITenantUserEditedPayload,
} from '../Users.types';
import { ABILITIES_CACHE } from '../../api/middleware/AuthorizationMiddleware';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';

@Injectable()
export class PurgeUserAbilityCacheSubscriber {
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
    ABILITIES_CACHE.del(tenantUser.systemUserId);
  }
}