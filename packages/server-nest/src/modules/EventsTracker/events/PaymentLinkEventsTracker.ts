import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import { INVOICE_PAYMENT_LINK_GENERATED } from '../event-tracker';

@Injectable()
export class PaymentLinkEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.saleInvoice.onPublicLinkGenerated)
  public handleTrackInvoicePublicLinkGeneratedEvent() {
    this.posthog.trackEvent({
      event: INVOICE_PAYMENT_LINK_GENERATED,
      properties: {},
    });
  }
}
