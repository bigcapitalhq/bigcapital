import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import { ClsService, UseCls } from 'nestjs-cls';
import {
  OrganizationBuildQueue,
  OrganizationBuildQueueJobPayload,
} from '../Organization.types';
import { BuildOrganizationService } from '../commands/BuildOrganization.service';

@Processor({
  name: OrganizationBuildQueue,
  scope: Scope.REQUEST,
})
export class OrganizationBuildProcessor extends WorkerHost {
  constructor(
    private readonly organizationBuildService: BuildOrganizationService,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job<OrganizationBuildQueueJobPayload>) {
    console.log('Processing organization build job:', job.id);

      this.clsService.set('organizationId', job.data.organizationId);
      this.clsService.set('userId', job.data.userId);

      try {
        await this.organizationBuildService.build(job.data.buildDto);
      } catch (e) {
        // Unlock build status of the tenant.
        await this.organizationBuildService.revertBuildRunJob();
        console.error('Error processing organization build job:', e);
        throw e; // Re-throw to mark job as failed
      }
  }
}
