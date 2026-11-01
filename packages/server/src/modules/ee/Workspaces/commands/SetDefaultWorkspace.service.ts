import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { events } from '@/common/events/events';
import { IWorkspaceSetDefaultEventPayload } from '../Workspaces.types';

@Injectable()
export class SetDefaultWorkspaceService {
  constructor(
    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Sets the given organization as the user's default workspace.
   * Validates that the user belongs to the organization.
   * @param userId - The user ID
   * @param organizationId - The organization ID to set as default
   */
  async setDefaultWorkspace(
    userId: number,
    organizationId: string,
  ): Promise<void> {
    // Find the tenant by organizationId
    const tenant = await this.tenantModel
      .query()
      .where('organization_id', organizationId)
      .first();

    if (!tenant) {
      throw new NotFoundException('Organization not found');
    }
    // Verify the user belongs to this organization
    const membership = await this.userTenantModel
      .query()
      .where('userId', userId)
      .where('tenantId', tenant.id)
      .first();

    if (!membership) {
      throw new NotFoundException('User does not belong to this organization');
    }
    // Update the user's default tenant
    await this.systemUserModel
      .query()
      .where('id', userId)
      .patch({ defaultTenantId: tenant.id });

    await this.eventEmitter.emitAsync(events.workspace.setDefault, {
      tenantId: tenant.id,
      organizationId,
      userId,
    } as IWorkspaceSetDefaultEventPayload);
  }
}
