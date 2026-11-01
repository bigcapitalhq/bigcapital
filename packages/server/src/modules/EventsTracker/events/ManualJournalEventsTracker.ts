import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IManualJournalEventCreatedPayload,
  IManualJournalEventEditedPayload,
  IManualJournalEventDeletedPayload,
} from '../../ManualJournals/types/ManualJournals.types';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  MANUAL_JOURNAL_CREATED,
  MANUAL_JOURNAL_EDITED,
  MANUAL_JOURNAL_DELETED,
} from '../event-tracker';

@Injectable()
export class ManualJournalEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.manualJournals.onCreated)
  public handleTrackManualJournalCreatedEvent(
    _payload: IManualJournalEventCreatedPayload,
  ) {
    this.posthog.trackEvent({
      event: MANUAL_JOURNAL_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.manualJournals.onEdited)
  public handleTrackEditedManualJournalEvent(
    _payload: IManualJournalEventEditedPayload,
  ) {
    this.posthog.trackEvent({
      event: MANUAL_JOURNAL_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.manualJournals.onDeleted)
  public handleTrackDeletedManualJournalEvent(
    _payload: IManualJournalEventDeletedPayload,
  ) {
    this.posthog.trackEvent({
      event: MANUAL_JOURNAL_DELETED,
      properties: {},
    });
  }
}
