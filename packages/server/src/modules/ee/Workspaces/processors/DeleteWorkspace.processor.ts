import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Scope } from '@nestjs/common';
import { ClsService, UseCls } from 'nestjs-cls';
import {
  DeleteWorkspaceQueue,
  DeleteWorkspaceQueueJobPayload,
} from '../Workspaces.types';
import { DeleteWorkspaceService } from '../commands/DeleteWorkspace.service';

@Processor({
  name: DeleteWorkspaceQueue,
  scope: Scope.REQUEST,
})
export class DeleteWorkspaceProcessor extends WorkerHost {
  constructor(
    private readonly deleteWorkspaceService: DeleteWorkspaceService,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job<DeleteWorkspaceQueueJobPayload>) {
    console.log('Processing workspace deletion job:', job.id);

    this.clsService.set('organizationId', job.data.organizationId);
    this.clsService.set('userId', job.data.userId);

    try {
      await this.deleteWorkspaceService.deleteWorkspace(
        job.data.userId,
        job.data.organizationId,
      );
      console.log('Workspace deletion completed successfully:', job.id);
    } catch (error) {
      console.error('Error processing workspace deletion job:', error);
      throw error; // Re-throw to mark job as failed
    }
  }
}
