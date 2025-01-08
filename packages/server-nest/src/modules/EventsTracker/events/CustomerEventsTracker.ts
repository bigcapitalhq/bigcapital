import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ICustomerEventCreatedPayload,
  ICustomerEventEditedPayload,
  ICustomerEventDeletedPayload,
} from '../../Customers/types/Customers.types';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  CUSTOMER_CREATED,
  CUSTOMER_EDITED,
  CUSTOMER_DELETED,
} from '../event-tracker';

@Injectable()
export class CustomerEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.customers.onCreated)
  public handleTrackCustomerCreatedEvent({}: ICustomerEventCreatedPayload) {
    this.posthog.trackEvent({
      event: CUSTOMER_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.customers.onEdited)
  public handleTrackEditedCustomerEvent({}: ICustomerEventEditedPayload) {
    this.posthog.trackEvent({
      event: CUSTOMER_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.customers.onDeleted)
  public handleTrackDeletedCustomerEvent({}: ICustomerEventDeletedPayload) {
    this.posthog.trackEvent({
      event: CUSTOMER_DELETED,
      properties: {},
    });
  }
}
