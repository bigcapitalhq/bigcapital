import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IBillPaymentEventCreatedPayload,
  IBillPaymentEditingPayload,
  IBillPaymentEventDeletedPayload,
} from '../../BillPayments/types/BillPayments.types';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  PAYMENT_MADE_CREATED,
  PAYMENT_MADE_EDITED,
  PAYMENT_MADE_DELETED,
} from '../event-tracker';

@Injectable()
export class PaymentMadeEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.billPayment.onCreated)
  public handleTrackPaymentMadeCreatedEvent({}: IBillPaymentEventCreatedPayload) {
    this.posthog.trackEvent({
      event: PAYMENT_MADE_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.billPayment.onEdited)
  public handleTrackEditedPaymentMadeEvent({}: IBillPaymentEditingPayload) {
    this.posthog.trackEvent({
      event: PAYMENT_MADE_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.billPayment.onDeleted)
  public handleTrackDeletedPaymentMadeEvent({}: IBillPaymentEventDeletedPayload) {
    this.posthog.trackEvent({
      event: PAYMENT_MADE_DELETED,
      properties: {},
    });
  }
}
