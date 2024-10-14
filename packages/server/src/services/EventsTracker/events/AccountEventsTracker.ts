import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IAccountEventCreatedPayload,
  IAccountEventEditedPayload,
  IAccountEventDeletedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  ACCOUNT_CREATED,
  ACCOUNT_EDITED,
  ACCOUNT_DELETED,
  ACCOUNT_VIEWED,
} from '@/constants/event-tracker';

@Service()
export class AccountEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.accounts.onCreated,
      this.handleTrackAccountCreatedEvent
    );
    bus.subscribe(events.accounts.onEdited, this.handleTrackEditedAccountEvent);
    bus.subscribe(
      events.accounts.onDeleted,
      this.handleTrackDeletedAccountEvent
    );
    bus.subscribe(events.accounts.onViewed, this.handleTrackAccountViewedEvent);
  }

  private handleTrackAccountCreatedEvent = ({
    tenantId,
  }: IAccountEventCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: ACCOUNT_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedAccountEvent = ({
    tenantId,
  }: IAccountEventEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: ACCOUNT_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedAccountEvent = ({
    tenantId,
  }: IAccountEventDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: ACCOUNT_DELETED,
      properties: {},
    });
  };

  private handleTrackAccountViewedEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: ACCOUNT_VIEWED,
      properties: {},
    });
  };
}
