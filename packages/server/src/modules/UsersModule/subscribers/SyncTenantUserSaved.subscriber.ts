import { pick } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import {
  ITenantUserActivatedPayload,
  ITenantUserEditedPayload,
  ITenantUserInactivatedPayload,
} from '../Users.types'
import { OnEvent } from '@nestjs/event-emitter';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { events } from '@/common/events/events';

@Injectable()
export class SyncTenantUserMutateSubscriber {
  constructor(
    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) {}

  /**
   * @param {ITenantUserEditedPayload} payload
   */
  @OnEvent(events.tenantUser.onEdited)
  async syncSystemUserOnceEdited({ tenantUser }: ITenantUserEditedPayload) {
    await this.systemUserModel
      .query()
      .where('id', tenantUser.systemUserId)
      .patch({
        ...pick(tenantUser, [
          'firstName',
          'lastName',
          'email',
          'active',
          'phoneNumber',
        ]),
      });
  }

  /**
   * Syncs activate system user.
   * @param {ITenantUserInactivatedPayload} payload -
   */
  @OnEvent(events.tenantUser.onActivated)
  async syncSystemUserOnceActivated({
    tenantUser,
  }: ITenantUserInactivatedPayload) {
    await this.systemUserModel
      .query()
      .where('id', tenantUser.systemUserId)
      .patch({
        active: true,
      });
  }

  /**
   * Syncs inactivate system user.
   * @param {ITenantUserActivatedPayload} payload -
   */
  @OnEvent(events.tenantUser.onInactivated)
  async syncSystemUserOnceInactivated({
    tenantUser,
  }: ITenantUserActivatedPayload) {
    await this.systemUserModel
      .query()
      .where('id', tenantUser.systemUserId)
      .patch({
        active: false,
      });
  }
}
