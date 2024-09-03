import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { ITransactionsLockingPartialUnlocked } from '@/interfaces';
import { PosthogService } from '../PostHog';
import {
  SUBSCRIPTION_CANCELLED,
  SUBSCRIPTION_PLAN_CHANGED,
  SUBSCRIPTION_RESUMED,
} from '@/constants/event-tracker';
import events from '@/subscribers/events';

@Service()
export class TransactionsLockingEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  public attach(bus) {
    bus.subscribe(
      events.subscription.onSubscriptionResumed,
      this.handleSubscriptionResumedEvent
    );
    bus.subscribe(
      events.subscription.onSubscriptionCancelled,
      this.handleSubscriptionCancelledEvent
    );
    bus.subscribe(
      events.subscription.onSubscriptionPlanChanged,
      this.handleSubscriptionPlanChangedEvent
    );
  }

  private handleSubscriptionResumedEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SUBSCRIPTION_RESUMED,
      properties: {},
    });
  };

  private handleSubscriptionCancelledEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SUBSCRIPTION_CANCELLED,
      properties: {},
    });
  };

  private handleSubscriptionPlanChangedEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SUBSCRIPTION_PLAN_CHANGED,
      properties: {},
    });
  };
}
