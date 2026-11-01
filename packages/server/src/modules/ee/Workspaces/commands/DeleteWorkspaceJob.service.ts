import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceError } from '@/modules/Items/ServiceError';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { TenantModel } from '@/modules/System/models/TenantModel';
import {
  DeleteWorkspaceQueue,
  DeleteWorkspaceQueueJobPayload,
} from '../Workspaces.types';
import { events } from '@/common/events/events';
import { WorkspacesError } from '../Workspaces.constants';

interface DeleteWorkspaceResult {
  jobId: string | number;
  organizationId: string;
}

@Injectable()
export class DeleteWorkspaceJobService {
  constructor(
    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,

    @InjectQueue(DeleteWorkspaceQueue)
    private readonly deleteWorkspaceQueue: Queue,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Initiates a workspace deletion by enqueueing a job.
   * Only the owner can delete a workspace.
   * @param {number} userId - The user id requesting deletion.
   * @param {string} organizationId - The organization id to delete.
   * @returns {Promise<DeleteWorkspaceResult>} - Returns the job id and organization id.
   */
  async initiateDelete(
    userId: number,
    organizationId: string,
  ): Promise<DeleteWorkspaceResult> {
    const tenant = await this.tenantModel.query().findOne({ organizationId });

    if (!tenant) {
      throw new ServiceError(WorkspacesError.WORKSPACE_NOT_FOUND);
    }

    const membership = await this.userTenantModel
      .query()
      .findOne({ userId, tenantId: tenant.id });

    if (!membership || membership.role !== 'owner') {
      throw new ServiceError(WorkspacesError.NOT_WORKSPACE_OWNER);
    }

    // Check if workspace is already being deleted.
    if (tenant.isDeleting) {
      throw new ServiceError(WorkspacesError.WORKSPACE_DELETING);
    }

    // Emit workspace deleting event.
    await this.eventEmitter.emitAsync(events.workspace.deleting, {
      organizationId,
      userId,
      tenantId: tenant.id,
    });

    // Mark the tenant as being deleted.
    await this.tenantModel.query().findById(tenant.id).patch({
      isDeleting: true,
    });

    // Enqueue the deletion job.
    const job = await this.deleteWorkspaceQueue.add('delete-workspace', {
      organizationId,
      userId,
    } as DeleteWorkspaceQueueJobPayload);

    return {
      jobId: job.id!,
      organizationId,
    };
  }
}
