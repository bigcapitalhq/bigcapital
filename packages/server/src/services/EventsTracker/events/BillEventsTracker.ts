import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IBillPaymentEventCreatedPayload,
  IBillPaymentEventEditedPayload,
  IBillPaymentEventDeletedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  BILL_CREATED,
  BILL_EDITED,
  BILL_DELETED,
} from '@/constants/event-tracker';

@Service()
export class BillEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(events.bill.onCreated, this.handleTrackBillCreatedEvent);
    bus.subscribe(events.bill.onEdited, this.handleTrackEditedBillEvent);
    bus.subscribe(events.bill.onDeleted, this.handleTrackDeletedBillEvent);
  }

  private handleTrackBillCreatedEvent = ({
    tenantId,
  }: IBillPaymentEventCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BILL_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedBillEvent = ({
    tenantId,
  }: IBillPaymentEventEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BILL_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedBillEvent = ({
    tenantId,
  }: IBillPaymentEventDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BILL_DELETED,
      properties: {},
    });
  };
}
