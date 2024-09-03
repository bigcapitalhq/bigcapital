import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  ICustomerEventCreatedPayload,
  ICustomerEventEditedPayload,
  ICustomerEventDeletedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  CUSTOMER_CREATED,
  CUSTOMER_EDITED,
  CUSTOMER_DELETED,
} from '@/constants/event-tracker';

@Service()
export class CustomerEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  public attach(bus) {
    bus.subscribe(
      events.customers.onCreated,
      this.handleTrackCustomerCreatedEvent
    );
    bus.subscribe(
      events.customers.onEdited,
      this.handleTrackEditedCustomerEvent
    );
    bus.subscribe(
      events.customers.onDeleted,
      this.handleTrackDeletedCustomerEvent
    );
  }

  private handleTrackCustomerCreatedEvent = ({
    tenantId,
  }: ICustomerEventCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: CUSTOMER_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedCustomerEvent = ({
    tenantId,
  }: ICustomerEventEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: CUSTOMER_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedCustomerEvent = ({
    tenantId,
  }: ICustomerEventDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: CUSTOMER_DELETED,
      properties: {},
    });
  };
}
