import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IBillPaymentEventCreatedPayload,
  IBillPaymentEditingPayload,
  IBillPaymentEventDeletedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  PAYMENT_MADE_CREATED,
  PAYMENT_MADE_EDITED,
  PAYMENT_MADE_DELETED,
} from '@/constants/event-tracker';

@Service()
export class PaymentMadeEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.billPayment.onCreated,
      this.handleTrackPaymentMadeCreatedEvent
    );
    bus.subscribe(
      events.billPayment.onEdited,
      this.handleTrackEditedPaymentMadeEvent
    );
    bus.subscribe(
      events.billPayment.onDeleted,
      this.handleTrackDeletedPaymentMadeEvent
    );
  }

  private handleTrackPaymentMadeCreatedEvent = ({
    tenantId,
  }: IBillPaymentEventCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_MADE_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedPaymentMadeEvent = ({
    tenantId,
  }: IBillPaymentEditingPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_MADE_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedPaymentMadeEvent = ({
    tenantId,
  }: IBillPaymentEventDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_MADE_DELETED,
      properties: {},
    });
  };
}
