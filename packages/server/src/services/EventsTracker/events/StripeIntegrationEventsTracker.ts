import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { ISaleInvoiceCreatedPayload } from '@/interfaces';
import { PosthogService } from '../PostHog';
import { STRIPE_INTEGRAION_CONNECTED } from '@/constants/event-tracker';
import events from '@/subscribers/events';

@Service()
export class StripeIntegrationEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.stripeIntegration.onOAuthCodeGranted,
      this.handleTrackOAuthCodeGrantedTrackEvent
    );
  }

  private handleTrackOAuthCodeGrantedTrackEvent = ({
    tenantId,
  }: ISaleInvoiceCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: STRIPE_INTEGRAION_CONNECTED,
      properties: {},
    });
  };
}
