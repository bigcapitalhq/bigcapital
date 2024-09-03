import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IVendorEventCreatedPayload,
  IVendorEventEditedPayload,
  IVendorEventDeletedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  VENDOR_CREATED,
  VENDOR_EDITED,
  VENDOR_DELETED,
} from '@/constants/event-tracker';

@Service()
export class VendorEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  public attach(bus) {
    bus.subscribe(events.vendors.onCreated, this.handleTrackVendorCreatedEvent);
    bus.subscribe(events.vendors.onEdited, this.handleTrackEditedVendorEvent);
    bus.subscribe(events.vendors.onDeleted, this.handleTrackDeletedVendorEvent);
  }

  private handleTrackVendorCreatedEvent = ({
    tenantId,
  }: IVendorEventCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: VENDOR_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedVendorEvent = ({
    tenantId,
  }: IVendorEventEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: VENDOR_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedVendorEvent = ({
    tenantId,
  }: IVendorEventDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: VENDOR_DELETED,
      properties: {},
    });
  };
}
