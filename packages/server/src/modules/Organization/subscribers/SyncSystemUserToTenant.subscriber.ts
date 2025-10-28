import { OnEvent } from '@nestjs/event-emitter';
import { SyncSystemUserToTenantService } from '../commands/SyncSystemUserToTenant.service';
import { events } from '@/common/events/events';
import { IOrganizationBuildEventPayload } from '../Organization.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncSystemUserToTenantSubscriber {
  constructor(
    private readonly syncSystemUserToTenantService: SyncSystemUserToTenantService,
  ) {}

  @OnEvent(events.organization.build)
  async onOrgBuildSyncSystemUser({ systemUser }: IOrganizationBuildEventPayload) {
    await this.syncSystemUserToTenantService.syncSystemUserToTenant(
      systemUser.id,
    );
  }
}
