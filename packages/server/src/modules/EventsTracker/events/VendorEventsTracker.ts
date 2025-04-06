import { Injectable } from '@nestjs/common';
import {
  IVendorEventCreatedPayload,
  IVendorEventEditedPayload,
  IVendorEventDeletedPayload,
} from '../../Vendors/types/Vendors.types';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  VENDOR_CREATED,
  VENDOR_EDITED,
  VENDOR_DELETED,
} from '../event-tracker';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class VendorEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.vendors.onCreated)
  public handleTrackVendorCreatedEvent({}: IVendorEventCreatedPayload) {
    this.posthog.trackEvent({
      event: VENDOR_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.vendors.onEdited)
  public handleTrackEditedVendorEvent({}: IVendorEventEditedPayload) {
    this.posthog.trackEvent({
      event: VENDOR_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.vendors.onDeleted)
  public handleTrackDeletedVendorEvent({}: IVendorEventDeletedPayload) {
    this.posthog.trackEvent({
      event: VENDOR_DELETED,
      properties: {},
    });
  }
}
