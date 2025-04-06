import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedEditedPayload,
  IPaymentReceivedDeletedPayload,
} from '../../PaymentReceived/types/PaymentReceived.types';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  PAYMENT_RECEIVED_CREATED,
  PAYMENT_RECEIVED_EDITED,
  PAYMENT_RECEIVED_DELETED,
  PAYMENT_RECEIVED_PDF_VIEWED,
  PAYMENT_RECEIVED_MAIL_SENT,
} from '../event-tracker';

@Injectable()
export class PaymentReceivedEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.paymentReceive.onCreated)
  public handleTrackPaymentReceivedCreatedEvent({}: IPaymentReceivedCreatedPayload) {
    this.posthog.trackEvent({
      event: PAYMENT_RECEIVED_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.paymentReceive.onEdited)
  public handleTrackEditedPaymentReceivedEvent({}: IPaymentReceivedEditedPayload) {
    this.posthog.trackEvent({
      event: PAYMENT_RECEIVED_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.paymentReceive.onDeleted)
  public handleTrackDeletedPaymentReceivedEvent({}: IPaymentReceivedDeletedPayload) {
    this.posthog.trackEvent({
      event: PAYMENT_RECEIVED_DELETED,
      properties: {},
    });
  }

  @OnEvent(events.paymentReceive.onPdfViewed)
  public handleTrackPdfViewedPaymentReceivedEvent({}: IPaymentReceivedDeletedPayload) {
    this.posthog.trackEvent({
      event: PAYMENT_RECEIVED_PDF_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.paymentReceive.onMailSent)
  public handleTrackMailSentPaymentReceivedEvent({}: IPaymentReceivedDeletedPayload) {
    this.posthog.trackEvent({
      event: PAYMENT_RECEIVED_MAIL_SENT,
      properties: {},
    });
  }
}
