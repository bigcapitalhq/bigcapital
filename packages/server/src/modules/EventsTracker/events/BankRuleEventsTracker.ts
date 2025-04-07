import {
  IBankRuleEventCreatedPayload,
  IBankRuleEventEditedPayload,
  IBankRuleEventDeletedPayload,
} from '../../BankRules/types';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  BANK_RULE_CREATED,
  BANK_RULE_EDITED,
  BANK_RULE_DELETED,
} from '../event-tracker';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BankRuleEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.bankRules.onCreated)
  public handleTrackBankRuleCreatedEvent({}: IBankRuleEventCreatedPayload) {
    this.posthog.trackEvent({
      event: BANK_RULE_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.bankRules.onEdited)
  public handleTrackEditedBankRuleEvent({}: IBankRuleEventEditedPayload) {
    this.posthog.trackEvent({
      event: BANK_RULE_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.bankRules.onDeleted)
  public handleTrackDeletedBankRuleEvent({}: IBankRuleEventDeletedPayload) {
    this.posthog.trackEvent({
      event: BANK_RULE_DELETED,
      properties: {},
    });
  }
}
