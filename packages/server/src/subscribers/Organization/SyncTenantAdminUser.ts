import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import OrganizationService from '@/services/Organization/OrganizationService';
import { IOrganizationBuildEventPayload } from '@/interfaces';

@Service()
export default class OrgSyncTenantAdminUserSubscriber {
  @Inject()
  organizationService: OrganizationService;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.organization.build, this.assignSystemUserAsAdminRole);
  }

  /**
   * Assign the authorized system user as admin role.
   */
  public assignSystemUserAsAdminRole = async ({
    tenantId,
    systemUser,
  }: IOrganizationBuildEventPayload) => {
    await this.organizationService.syncSystemUserToTenant(tenantId, systemUser);
  };
}
