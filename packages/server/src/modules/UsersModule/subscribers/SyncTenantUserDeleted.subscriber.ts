import { events } from '@/common/events/events';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ITenantUserDeletedPayload } from '../Users.types';

@Injectable()
export class SyncTenantUserDeleteSubscriber {
  constructor(
    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) {}

  /**
   * Deletes the system user once tenant user be deleted.
   * @param {ITenantUserDeletedPayload} payload -
   */
  @OnEvent(events.tenantUser.onDeleted)
  async syncSystemUserOnceUserDeleted({
    tenantUser,
  }: ITenantUserDeletedPayload) {
    await this.systemUserModel
      .query()
      .where('id', tenantUser.systemUserId)
      .delete();
  }
}
