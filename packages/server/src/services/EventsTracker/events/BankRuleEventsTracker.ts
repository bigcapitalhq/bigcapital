import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IBankRuleEventCreatedPayload,
  IBankRuleEventEditedPayload,
  IBankRuleEventDeletedPayload,
} from '@/services/Banking/Rules/types'; // Updated import path for interfaces
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  BANK_RULE_CREATED,
  BANK_RULE_EDITED,
  BANK_RULE_DELETED,
} from '@/constants/event-tracker';

@Service()
export class BankRuleEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.bankRules.onCreated,
      this.handleTrackBankRuleCreatedEvent
    );
    bus.subscribe(
      events.bankRules.onEdited,
      this.handleTrackEditedBankRuleEvent
    );
    bus.subscribe(
      events.bankRules.onDeleted,
      this.handleTrackDeletedBankRuleEvent
    );
  }

  private handleTrackBankRuleCreatedEvent = ({
    tenantId,
  }: IBankRuleEventCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BANK_RULE_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedBankRuleEvent = ({
    tenantId,
  }: IBankRuleEventEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BANK_RULE_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedBankRuleEvent = ({
    tenantId,
  }: IBankRuleEventDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BANK_RULE_DELETED,
      properties: {},
    });
  };
}
