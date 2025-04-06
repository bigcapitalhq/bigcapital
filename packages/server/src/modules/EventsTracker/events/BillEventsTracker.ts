import { Injectable } from '@nestjs/common';
import {
  IBillPaymentEventCreatedPayload,
  IBillPaymentEventEditedPayload,
  IBillPaymentEventDeletedPayload,
} from '../../BillPayments/types/BillPayments.types';
import { EventTrackerService } from '../EventTracker.service';
import { BILL_CREATED, BILL_EDITED, BILL_DELETED } from '../event-tracker';
import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BillEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.bill.onCreated)
  public handleTrackBillCreatedEvent({}: IBillPaymentEventCreatedPayload) {
    this.posthog.trackEvent({
      event: BILL_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.bill.onEdited)
  public handleTrackEditedBillEvent({}: IBillPaymentEventEditedPayload) {
    this.posthog.trackEvent({
      event: BILL_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.bill.onDeleted)
  public handleTrackDeletedBillEvent({}: IBillPaymentEventDeletedPayload) {
    this.posthog.trackEvent({
      event: BILL_DELETED,
      properties: {},
    });
  }
}
