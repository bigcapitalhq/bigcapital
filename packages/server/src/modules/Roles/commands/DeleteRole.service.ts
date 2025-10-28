import { Knex } from 'knex';
import { IRoleDeletedPayload } from '../Roles.types';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import { Role } from '../models/Role.model';
import { RolePermission } from '../models/RolePermission.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { Inject, Injectable } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { validateRoleNotPredefined } from '../Roles.utils';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';

@Injectable()
export class DeleteRoleService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Role.name)
    private readonly roleModel: TenantModelProxy<typeof Role>,

    @Inject(RolePermission.name)
    private readonly rolePermissionModel: TenantModelProxy<
      typeof RolePermission
    >,

    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,
  ) {}

  /**
   * Deletes the given role from the storage.
   * @param {number} roleId - Role id.
   */
  public async deleteRole(roleId: number): Promise<void> {
    // Retrieve the given role or throw not found service error.
    const oldRole = await this.roleModel()
      .query()
      .findById(roleId)
      .throwIfNotFound();

    // Validate role is not predefined.
    validateRoleNotPredefined(oldRole);

    // Validates the given role is not associated to any user.
    await this.validateRoleNotAssociatedToUser(roleId);

    // Deletes the given role and associated models under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Deletes the role associated permissions from the storage.
      await this.rolePermissionModel()
        .query(trx)
        .where('roleId', roleId)
        .delete();

      // Deletes the role object form the storage.
      await Role.query(trx).findById(roleId).delete();

      // Triggers `onRoleDeleted` event.
      await this.eventPublisher.emitAsync(events.roles.onDeleted, {
        oldRole,
        roleId,
        trx,
      } as IRoleDeletedPayload);
    });
  }
  /**
   * Validates the given role is not associated to any tenant users.
   * @param {number} roleId
   */
  private validateRoleNotAssociatedToUser = async (roleId: number) => {
    const userAssociatedRole = await this.tenantUserModel()
      .query()
      .where('roleId', roleId);

    // Throw service error if the role has associated users.
    if (userAssociatedRole.length > 0) {
      throw new ServiceError(ERRORS.CANNT_DELETE_ROLE_ASSOCIATED_TO_USERS);
    }
  };
}
