import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IManualJournalEventCreatedPayload,
  IManualJournalEventEditedPayload,
  IManualJournalEventDeletedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  MANUAL_JOURNAL_CREATED,
  MANUAL_JOURNAL_EDITED,
  MANUAL_JOURNAL_DELETED,
} from '@/constants/event-tracker';

@Service()
export class ManualJournalEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.manualJournals.onCreated,
      this.handleTrackManualJournalCreatedEvent
    );
    bus.subscribe(
      events.manualJournals.onEdited,
      this.handleTrackEditedManualJournalEvent
    );
    bus.subscribe(
      events.manualJournals.onDeleted,
      this.handleTrackDeletedManualJournalEvent
    );
  }

  private handleTrackManualJournalCreatedEvent = ({
    tenantId,
  }: IManualJournalEventCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: MANUAL_JOURNAL_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedManualJournalEvent = ({
    tenantId,
  }: IManualJournalEventEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: MANUAL_JOURNAL_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedManualJournalEvent = ({
    tenantId,
  }: IManualJournalEventDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: MANUAL_JOURNAL_DELETED,
      properties: {},
    });
  };
}
