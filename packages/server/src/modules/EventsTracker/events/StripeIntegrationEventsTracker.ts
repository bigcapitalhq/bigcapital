import { events } from '@/common/events/events';
import { ISaleInvoiceCreatedPayload } from '@/modules/SaleInvoices/SaleInvoice.types';
import { OnEvent } from '@nestjs/event-emitter';
import { STRIPE_INTEGRAION_CONNECTED } from '../event-tracker';
import { EventTrackerService } from '../EventTracker.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeIntegrationEventsTracker {
  constructor(private readonly posthog: EventTrackerService) {}

  @OnEvent(events.stripeIntegration.onOAuthCodeGranted)
  public handleTrackOAuthCodeGrantedTrackEvent({}: ISaleInvoiceCreatedPayload) {
    this.posthog.trackEvent({
      event: STRIPE_INTEGRAION_CONNECTED,
      properties: {},
    });
  }
}
