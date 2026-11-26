import { Job, Queue } from 'bullmq';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import {
  OrganizationBuildQueue,
  OrganizationBuildQueueJobPayload,
} from '../Organization.types';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../Organization.constants';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { TenantModel } from '@/modules/System/models/TenantModel';

@Injectable()
export class GetBuildOrganizationBuildJob {
  constructor(
    @InjectQueue(OrganizationBuildQueue)
    private readonly organizationBuildQueue: Queue,

    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,
  ) {}

  /**
   * Determines whether the given user belongs to the organization
   * the build job is provisioning.
   * @param {Job<OrganizationBuildQueueJobPayload>} job - The build job.
   * @param {number} userId - The authenticated user id.
   * @returns {Promise<boolean>}
   */
  private async isUserAllowedToAccessJob(
    job: Job<OrganizationBuildQueueJobPayload>,
    userId: number,
  ): Promise<boolean> {
    const organizationId = job.data?.organizationId;

    if (!organizationId) {
      return false;
    }
    const tenant = await this.tenantModel.query().findOne({ organizationId });

    if (!tenant) {
      return false;
    }
    const membership = await this.userTenantModel
      .query()
      .findOne({ userId, tenantId: tenant.id });

    return !!membership;
  }

  /**
   * Gets the build job details by job ID.
   * Only the users who belong to the organization being built can access
   * the job details.
   * @param {string} jobId - The ID of the job to retrieve.
   * @param {number} userId - The ID of the authenticated user.
   * @returns {Promise<any>} - Returns the job details.
   */
  async getJobDetails(jobId: string, userId: number): Promise<any> {
    const job = await this.organizationBuildQueue.getJob(jobId);

    // Respond with 404 for jobs that don't exist or belong to organizations
    // the authenticated user isn't a member of to avoid leaking their existence.
    if (!job || !(await this.isUserAllowedToAccessJob(job, userId))) {
      throw new ServiceError(
        ERRORS.JOB_NOT_FOUND,
        'Job not found',
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    const state = await job.getState();

    return {
      id: job.id,
      state,
      progress: job.progress,
      isCompleted: state === 'completed',
      isRunning: state === 'active',
      isWaiting: state === 'waiting' || state === 'waiting-children',
      isFailed: state === 'failed',
    };
  }
}
