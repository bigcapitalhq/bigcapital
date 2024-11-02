import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedEditedPayload,
  IPaymentReceivedDeletedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  PAYMENT_RECEIVED_CREATED,
  PAYMENT_RECEIVED_EDITED,
  PAYMENT_RECEIVED_DELETED,
  PAYMENT_RECEIVED_PDF_VIEWED,
  PAYMENT_RECEIVED_MAIL_SENT,
} from '@/constants/event-tracker';

@Service()
export class PaymentReceivedEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.paymentReceive.onCreated,
      this.handleTrackPaymentReceivedCreatedEvent
    );
    bus.subscribe(
      events.paymentReceive.onEdited,
      this.handleTrackEditedPaymentReceivedEvent
    );
    bus.subscribe(
      events.paymentReceive.onDeleted,
      this.handleTrackDeletedPaymentReceivedEvent
    );
    bus.subscribe(
      events.paymentReceive.onPdfViewed,
      this.handleTrackPdfViewedPaymentReceivedEvent
    );
    bus.subscribe(
      events.paymentReceive.onMailSent,
      this.handleTrackMailSentPaymentReceivedEvent
    );
  }

  private handleTrackPaymentReceivedCreatedEvent = ({
    tenantId,
  }: IPaymentReceivedCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_RECEIVED_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedPaymentReceivedEvent = ({
    tenantId,
  }: IPaymentReceivedEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_RECEIVED_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedPaymentReceivedEvent = ({
    tenantId,
  }: IPaymentReceivedDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_RECEIVED_DELETED,
      properties: {},
    });
  };

  private handleTrackPdfViewedPaymentReceivedEvent = ({
    tenantId,
  }: IPaymentReceivedDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_RECEIVED_PDF_VIEWED,
      properties: {},
    });
  };

  private handleTrackMailSentPaymentReceivedEvent = ({
    tenantId,
  }: IPaymentReceivedDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYMENT_RECEIVED_MAIL_SENT,
      properties: {},
    });
  };
}
