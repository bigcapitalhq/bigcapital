import { Injectable } from '@nestjs/common';
import {
  IAccountEventCreatedPayload,
  IAccountEventEditedPayload,
  IAccountEventDeletedPayload,
} from '../../Accounts/Accounts.types';
import { EventTrackerService } from '../EventTracker.service';
import {
  ACCOUNT_CREATED,
  ACCOUNT_EDITED,
  ACCOUNT_DELETED,
  ACCOUNT_VIEWED,
} from '../event-tracker';
import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AccountEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.accounts.onCreated)
  public handleTrackAccountCreatedEvent({}: IAccountEventCreatedPayload) {
    this.posthog.trackEvent({
      event: ACCOUNT_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.accounts.onEdited)
  public handleTrackEditedAccountEvent({}: IAccountEventEditedPayload) {
    this.posthog.trackEvent({
      event: ACCOUNT_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.accounts.onDeleted)
  public handleTrackDeletedAccountEvent({}: IAccountEventDeletedPayload) {
    this.posthog.trackEvent({
      event: ACCOUNT_DELETED,
      properties: {},
    });
  }

  @OnEvent(events.accounts.onViewed)
  public handleTrackAccountViewedEvent({}) {
    this.posthog.trackEvent({
      event: ACCOUNT_VIEWED,
      properties: {},
    });
  }
}
