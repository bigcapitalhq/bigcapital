import {
  SUBSCRIPTION_CANCELLED,
  SUBSCRIPTION_PAYMENT_FAILED,
  SUBSCRIPTION_PAYMENT_SUCCEED,
  SUBSCRIPTION_PLAN_CHANGED,
  SUBSCRIPTION_RESUMED,
} from '../event-tracker';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';

@Injectable()
export class TransactionsLockingEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.subscription.onSubscriptionResumed)
  public handleSubscriptionResumedEvent() {
    this.posthog.trackEvent({
      event: SUBSCRIPTION_RESUMED,
      properties: {},
    });
  }

  @OnEvent(events.subscription.onSubscriptionCancelled)
  public handleSubscriptionCancelledEvent() {
    this.posthog.trackEvent({
      event: SUBSCRIPTION_CANCELLED,
      properties: {},
    });
  }

  @OnEvent(events.subscription.onSubscriptionPlanChanged)
  public handleSubscriptionPlanChangedEvent() {
    this.posthog.trackEvent({
      event: SUBSCRIPTION_PLAN_CHANGED,
      properties: {},
    });
  }

  @OnEvent(events.subscription.onSubscriptionPaymentFailed)
  public handleSubscriptionPaymentFailedEvent() {
    this.posthog.trackEvent({
      event: SUBSCRIPTION_PAYMENT_FAILED,
      properties: {},
    });
  }

  @OnEvent(events.subscription.onSubscriptionPaymentSucceed)
  public handleSubscriptionPaymentSucceed() {
    this.posthog.trackEvent({
      event: SUBSCRIPTION_PAYMENT_SUCCEED,
      properties: {},
    });
  }
}
