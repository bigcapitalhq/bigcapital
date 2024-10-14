import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IItemEventCreatedPayload,
  IItemEventEditedPayload,
  IItemEventDeletedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  ITEM_EVENT_CREATED,
  ITEM_EVENT_EDITED,
  ITEM_EVENT_DELETED,
  ITEM_EVENT_VIEWED,
} from '@/constants/event-tracker';

@Service()
export class ItemEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(events.item.onCreated, this.handleTrackItemCreatedEvent);
    bus.subscribe(events.item.onEdited, this.handleTrackEditedItemEvent);
    bus.subscribe(events.item.onDeleted, this.handleTrackDeletedItemEvent);
    bus.subscribe(events.item.onViewed, this.handleTrackViewedItemEvent);
  }

  private handleTrackItemCreatedEvent = ({
    tenantId,
  }: IItemEventCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: ITEM_EVENT_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedItemEvent = ({
    tenantId,
  }: IItemEventEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: ITEM_EVENT_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedItemEvent = ({
    tenantId,
  }: IItemEventDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: ITEM_EVENT_DELETED,
      properties: {},
    });
  };

  private handleTrackViewedItemEvent = ({
    tenantId,
  }: IItemEventDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: ITEM_EVENT_VIEWED,
      properties: {},
    });
  };
}
