import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';
import { Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import {
  OrganizationBuildQueue,
  OrganizationBuildQueueJob,
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
  ) {
    super();
  }

  @Process(OrganizationBuildQueueJob)
  async process(job: Job<OrganizationBuildQueueJobPayload>) {
    try {
      await this.organizationBuildService.build(job.data.buildDto);
    } catch (e) {
      // Unlock build status of the tenant.
      await this.organizationBuildService.revertBuildRunJob();
      console.error(e);
    }
  }
}
