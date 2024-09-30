import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  PAYMENT_METHOD_EDITED,
  PAYMENT_METHOD_DELETED,
} from '@/constants/event-tracker';

@Service()
export class PaymentMethodEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.paymentMethod.onEdited,
      this.handleTrackPaymentMethodEditedEvent
    );
    bus.subscribe(
      events.paymentMethod.onDeleted,
      this.handleTrackPaymentMethodDeletedEvent
    );
  }

  private handleTrackPaymentMethodEditedEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_METHOD_EDITED,
      properties: {},
    });
  };

  private handleTrackPaymentMethodDeletedEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_METHOD_DELETED,
      properties: {},
    });
  };
}
