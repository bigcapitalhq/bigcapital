import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ModelObject } from 'objection';
import { ServiceError } from '../Items/ServiceError';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { TenantUser } from '../Tenancy/TenancyModels/models/TenantUser.model';
import { ERRORS } from './constants';
import { Role } from './models/Role.model';
import { isAdminRole, canRoleGrantRole } from './utils';

/**
 * Policy that guards the assignment of roles to tenant users.
 */
@Injectable()
export class RolesPolicy {
  constructor(
    private readonly clsService: ClsService,

    @Inject(TenantUser.name)
    private readonly tenantUserModel: TenantModelProxy<typeof TenantUser>,

    @Inject(Role.name)
    private readonly roleModel: TenantModelProxy<typeof Role>,
  ) {}

  /**
   * Validates the authorized user is allowed to grant the given role.
   * @param {number} roleId - The role id to assign.
   * @throws {ServiceError}
   */
  public async validateRoleAssignment(roleId: number): Promise<void> {
    const actorRole = await this.getAuthorizedUserRole();

    const targetRole = await this.roleModel()
      .query()
      .findById(roleId)
      .withGraphFetched('permissions');

    if (!targetRole) {
      throw new ServiceError(ERRORS.ROLE_NOT_FOUND);
    }
    if (!canRoleGrantRole(actorRole, targetRole)) {
      throw new ServiceError(ERRORS.CANNOT_GRANT_ROLE);
    }
  }

  /**
   * Validates the given tenant user is not the last active admin.
   * @param {number} tenantUserId - The tenant user id.
   * @throws {ServiceError}
   */
  public async validateNotLastAdmin(tenantUserId: number): Promise<void> {
    const tenantUser = await this.tenantUserModel()
      .query()
      .findById(tenantUserId)
      .withGraphFetched('role');

    if (!tenantUser || !this.isActiveAdmin(tenantUser)) {
      return;
    }
    const adminRole = await this.roleModel().query().findOne('slug', 'admin');

    if (!adminRole) {
      return;
    }
    const remainingAdmins = await this.tenantUserModel()
      .query()
      .where('roleId', adminRole.id)
      .whereNot('id', tenantUserId)
      .where('active', true)
      .whereNotNull('inviteAcceptedAt')
      .resultSize();

    if (remainingAdmins === 0) {
      throw new ServiceError(ERRORS.CANNOT_REMOVE_LAST_ADMIN);
    }
  }

  /**
   * Detarmines whether the given tenant user is an active admin.
   * @param {ModelObject<TenantUser>} tenantUser - Tenant user.
   * @returns {boolean}
   */
  private isActiveAdmin(tenantUser: ModelObject<TenantUser>): boolean {
    return (
      isAdminRole(tenantUser.role) &&
      !!tenantUser.active &&
      !!tenantUser.inviteAcceptedAt
    );
  }

  /**
   * Retrieves the role of the authorized tenant user.
   * @returns {Promise<ModelObject<Role>>}
   */
  private async getAuthorizedUserRole(): Promise<ModelObject<Role>> {
    const userId = this.clsService.get<number>('userId');

    const tenantUser = await this.tenantUserModel()
      .query()
      .findOne('systemUserId', userId)
      .withGraphFetched('role.permissions')
      .throwIfNotFound();

    return tenantUser.role;
  }
}
