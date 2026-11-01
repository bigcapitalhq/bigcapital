import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { WorkspacesError } from '../Workspaces.constants';

@Injectable()
export class InactivateWorkspaceService {
  constructor(
    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
  ) {}

  /**
   * Inactivates a workspace. Only the owner can inactivate.
   * @param {number} userId - User ID of the user who is inactivating the workspace.
   * @param {string} organizationId - Organization ID of the workspace to inactivate.
   * @returns {Promise<void>}
   */
  async inactivateWorkspace(
    userId: number,
    organizationId: string,
  ): Promise<void> {
    const tenant = await this.tenantModel.query().findOne({ organizationId });

    if (!tenant) {
      throw new ServiceError(
        WorkspacesError.WORKSPACE_NOT_FOUND,
        'Workspace not found',
      );
    }
    const membership = await this.userTenantModel
      .query()
      .findOne({ userId, tenantId: tenant.id })
      .withGraphFetched('tenant');

    if (!membership) {
      throw new ServiceError(
        WorkspacesError.WORKSPACE_NOT_FOUND,
        'Workspace not found',
      );
    }
    if (membership.role !== 'owner') {
      throw new ServiceError(
        WorkspacesError.NOT_WORKSPACE_OWNER,
        'Only the workspace owner can inactivate the workspace',
      );
    }
    await this.tenantModel.query().findById(tenant.id).patch({
      isInactive: true,
    });
  }

  /**
   * Reactivates a workspace. Only the owner can reactivate.
   * @param {number} userId - User ID of the user who is reactivating the workspace.
   * @param {string} organizationId - Organization ID of the workspace to reactivate.
   * @returns {Promise<void>}
   */
  async activateWorkspace(
    userId: number,
    organizationId: string,
  ): Promise<void> {
    const tenant = await this.tenantModel.query().findOne({ organizationId });

    if (!tenant) {
      throw new ServiceError(
        WorkspacesError.WORKSPACE_NOT_FOUND,
        'Workspace not found',
      );
    }
    const membership = await this.userTenantModel
      .query()
      .findOne({ userId, tenantId: tenant.id })
      .withGraphFetched('tenant');

    if (!membership) {
      throw new ServiceError(
        WorkspacesError.WORKSPACE_NOT_FOUND,
        'Workspace not found',
      );
    }
    if (membership.role !== 'owner') {
      throw new ServiceError(
        WorkspacesError.NOT_WORKSPACE_OWNER,
        'Only the workspace owner can reactivate the workspace',
      );
    }

    await this.tenantModel.query().findById(tenant.id).patch({
      isInactive: false,
    });
  }
}
