import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { PosthogService } from '../PostHog';
import { INVOICE_PAYMENT_LINK_GENERATED } from '@/constants/event-tracker';
import events from '@/subscribers/events';

@Service()
export class PaymentLinkEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onPublicLinkGenerated,
      this.handleTrackInvoicePublicLinkGeneratedEvent
    );
  }

  public handleTrackInvoicePublicLinkGeneratedEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: INVOICE_PAYMENT_LINK_GENERATED,
      properties: {},
    });
  };
}
