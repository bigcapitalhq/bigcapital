import { Injectable } from '@nestjs/common';
import { GetBuildOrganizationBuildJob } from '@/modules/Organization/commands/GetBuildOrganizationJob.service';

@Injectable()
export class GetWorkspaceBuildJobService {
  constructor(
    private readonly getBuildJobService: GetBuildOrganizationBuildJob,
  ) {}

  /**
   * Returns the current status of a workspace build job.
   */
  getJobDetails(buildJobId: string) {
    return this.getBuildJobService.getJobDetails(buildJobId);
  }
}
