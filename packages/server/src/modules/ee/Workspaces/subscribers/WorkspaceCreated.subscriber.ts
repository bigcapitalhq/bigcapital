import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { IWorkspaceCreatedEventPayload } from '../Workspaces.types';

@Injectable()
export class WorkspaceCreatedSubscriber {
  constructor(
    // Inject services needed for workspace setup
    // e.g., private readonly someSetupService: SomeSetupService,
  ) {}

  @OnEvent(events.workspace.created)
  async handleWorkspaceCreated({
    tenantId,
    organizationId,
    userId,
    buildDTO,
  }: IWorkspaceCreatedEventPayload) {
    // Handle any setup that needs to happen after workspace creation.
    // This runs after system-level metadata is saved in tenants_metadata.
    // Note: The tenant database is not ready yet - the build job will handle that later.
  }
}
