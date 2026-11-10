import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IWorkspaceCreatedEventPayload } from '@/modules/ee/Workspaces/Workspaces.types';
import { StartTrialSubscriptionService } from '../commands/StartTrialSubscription.service';

@Injectable()
export class StartTrialOnWorkspaceCreatedCloud {
  constructor(
    private readonly startTrialSubscription: StartTrialSubscriptionService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Starts a full-access trial when an existing Cloud user creates another
   * workspace. Each workspace is a separate organization/tenant.
   */
  @OnEvent(events.workspace.created)
  async startTrialOnWorkspaceCreated({
    tenantId,
  }: IWorkspaceCreatedEventPayload): Promise<void> {
    if (this.configService.get('cloud.hostedOnCloud') !== true) return;

    await this.startTrialSubscription.execute(tenantId);
  }
}
