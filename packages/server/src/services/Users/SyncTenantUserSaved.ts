import { pick } from 'lodash';
import {
  ITenantUser,
  ITenantUserActivatedPayload,
  ITenantUserDeletedPayload,
  ITenantUserEditedPayload,
  ITenantUserInactivatedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { SystemUser } from '@/system/models';

export default class SyncTenantUserMutate {
  /**
   * Attaches events with handlers.
   * @param bus
   */
  attach(bus) {
    bus.subscribe(events.tenantUser.onEdited, this.syncSystemUserOnceEdited);
    bus.subscribe(
      events.tenantUser.onActivated,
      this.syncSystemUserOnceActivated
    );
    bus.subscribe(
      events.tenantUser.onInactivated,
      this.syncSystemUserOnceInactivated
    );
  }
  /**
   *
   * @param tenantUser
   */
  private syncSystemUserOnceEdited = async ({
    tenantUser,
  }: ITenantUserEditedPayload) => {
    await SystemUser.query()
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
  };

  /**
   * Syncs activate system user.
   * @param {ITenantUserInactivatedPayload} payload -
   */
  private syncSystemUserOnceActivated = async ({
    tenantUser,
  }: ITenantUserInactivatedPayload) => {
    await SystemUser.query().where('id', tenantUser.systemUserId).patch({
      active: true,
    });
  };

  /**
   * Syncs inactivate system user.
   * @param {ITenantUserActivatedPayload} payload -
   */
  private syncSystemUserOnceInactivated = async ({
    tenantUser,
  }: ITenantUserActivatedPayload) => {
    await SystemUser.query().where('id', tenantUser.systemUserId).patch({
      active: false,
    });
  };
}
