import { Inject, Injectable } from '@nestjs/common';
// import { PostHog, EventMessage } from 'posthog-node';
import { POSTHOG } from './postHog.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

interface EventMessage {
  distinctId 
}
@Injectable()
export class EventTrackerService {
  constructor(
    @Inject(POSTHOG) private readonly posthog: any,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Track tenant an event.
   * @param event - The event to track.
   */
  public async trackEvent(event: any) {
    // Cannot continue if the Posthog not configured.
    if (!this.posthog) return;

    const tenant = await this.tenancyContext.getTenant();
    const authorizedUser = await this.tenancyContext.getSystemUser();

    if (!tenant || !authorizedUser) {
      throw new Error('Tenant or authorized user not found');
    }
    const distinctId = `tenant-${tenant.id}-user-${authorizedUser.id}`;
    const properties = {
      ...event.properties,
      tenantId: tenant.id,
      userId: authorizedUser.id,
    };
    this.posthog.capture({
      ...event,
      distinctId,
      properties,
    });
  }
}
