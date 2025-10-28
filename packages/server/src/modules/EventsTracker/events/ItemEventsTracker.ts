import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IItemEventCreatedPayload,
  IItemEventEditedPayload,
  IItemEventDeletedPayload,
} from '@/interfaces/Item';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  ITEM_EVENT_CREATED,
  ITEM_EVENT_EDITED,
  ITEM_EVENT_DELETED,
  ITEM_EVENT_VIEWED,
} from '../event-tracker';

@Injectable()
export class ItemEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.item.onCreated)
  public handleTrackItemCreatedEvent({}: IItemEventCreatedPayload) {
    this.posthog.trackEvent({
      event: ITEM_EVENT_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.item.onEdited)
  public handleTrackEditedItemEvent({}: IItemEventEditedPayload) {
    this.posthog.trackEvent({
      event: ITEM_EVENT_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.item.onDeleted)
  public handleTrackDeletedItemEvent({}: IItemEventDeletedPayload) {
    this.posthog.trackEvent({
      event: ITEM_EVENT_DELETED,
      properties: {},
    });
  }

  @OnEvent(events.item.onViewed)
  public handleTrackViewedItemEvent({}: IItemEventDeletedPayload) {
    this.posthog.trackEvent({
      event: ITEM_EVENT_VIEWED,
      properties: {},
    });
  }
}
