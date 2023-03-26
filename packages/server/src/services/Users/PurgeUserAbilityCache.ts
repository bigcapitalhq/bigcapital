import events from '@/subscribers/events';
import {
  ITenantUserInactivatedPayload,
  ITenantUserActivatedPayload,
  ITenantUserDeletedPayload,
  ITenantUserEditedPayload,
} from '@/interfaces';
import { ABILITIES_CACHE } from '../../api/middleware/AuthorizationMiddleware';

export default class PurgeUserAbilityCache {
  /**
   * Attaches events with handlers.
   * @param bus
   */
  attach(bus) {
    bus.subscribe(events.tenantUser.onEdited, this.purgeAuthorizedUserAbility);
    bus.subscribe(
      events.tenantUser.onActivated,
      this.purgeAuthorizedUserAbility
    );
    bus.subscribe(
      events.tenantUser.onInactivated,
      this.purgeAuthorizedUserAbility
    );
  }

  /**
   * Purges authorized user ability once the user mutate.
   */
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
