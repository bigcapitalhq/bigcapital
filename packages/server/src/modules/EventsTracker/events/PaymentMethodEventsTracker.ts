import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  PAYMENT_METHOD_EDITED,
  PAYMENT_METHOD_DELETED,
} from '../event-tracker';

@Injectable()
export class PaymentMethodEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.paymentMethod.onEdited)
  public handleTrackPaymentMethodEditedEvent({}) {
    this.posthog.trackEvent({
      event: PAYMENT_METHOD_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.paymentMethod.onDeleted)
  public handleTrackPaymentMethodDeletedEvent({}) {
    this.posthog.trackEvent({
      event: PAYMENT_METHOD_DELETED,
      properties: {},
    });
  }
}
