import { Inject, Injectable } from '@nestjs/common';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { POSTHOG_PROVIDER } from './PostHog.constants';

export interface IdentifyMessage {
  distinctId: string;
  properties?: Record<string | number, any>;
  disableGeoip?: boolean;
}

export interface EventMessage extends IdentifyMessage {
  event: string;
  groups?: Record<string, string | number>; // Mapping of group type to group id
  sendFeatureFlags?: boolean;
  timestamp?: Date;
  uuid?: string;
}

@Injectable()
export class EventTrackerService {
  constructor(
    private readonly tenancyContext: TenancyContext,
    @Inject(POSTHOG_PROVIDER) private readonly posthog: any,
  ) {}

  /**
   * Track tenant an event.
   * @param event - The event to track.
   */
  public async trackEvent(event: Omit<EventMessage, 'distinctId'>) {
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
