import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { events } from '@/common/events/events';
import { purgeTenantAbilities } from '../TenantAbilities';

@Injectable()
export class PurgeTenantAbilitiesSubscriber {
  constructor(private readonly clsService: ClsService) {}

  /**
   * Purges the tenant cached abilities once a role permissions changed,
   * otherwise stale abilities of the role users would be served.
   */
  @OnEvent(events.roles.onEdited)
  @OnEvent(events.roles.onDeleted)
  purgeCachedAbilities() {
    const organizationId = this.clsService.get<string>('organizationId');

    if (organizationId == null) {
      return;
    }
    purgeTenantAbilities(organizationId);
  }
}
