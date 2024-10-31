import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceEditedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  SALE_INVOICE_CREATED,
  SALE_INVOICE_DELETED,
  SALE_INVOICE_EDITED,
  SALE_INVOICE_MAIL_SENT,
  SALE_INVOICE_PDF_VIEWED,
  SALE_INVOICE_VIEWED,
} from '@/constants/event-tracker';

@Service()
export class SaleInvoiceEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleTrackInvoiceCreatedEvent
    );
    bus.subscribe(
      events.saleInvoice.onEdited,
      this.handleTrackEditedInvoiceEvent
    );
    bus.subscribe(
      events.saleInvoice.onDeleted,
      this.handleTrackDeletedInvoiceEvent
    );
    bus.subscribe(
      events.saleInvoice.onViewed,
      this.handleTrackViewedInvoiceEvent
    );
    bus.subscribe(
      events.saleInvoice.onPdfViewed,
      this.handleTrackPdfViewedInvoiceEvent
    );
    bus.subscribe(
      events.saleInvoice.onMailSent,
      this.handleTrackMailSentInvoiceEvent
    );
  }

  private handleTrackInvoiceCreatedEvent = ({
    tenantId,
  }: ISaleInvoiceCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_INVOICE_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedInvoiceEvent = ({
    tenantId,
  }: ISaleInvoiceEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_INVOICE_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedInvoiceEvent = ({
    tenantId,
  }: ISaleInvoiceEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_INVOICE_DELETED,
      properties: {},
    });
  };

  private handleTrackViewedInvoiceEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_INVOICE_VIEWED,
      properties: {},
    });
  };

  private handleTrackPdfViewedInvoiceEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_INVOICE_PDF_VIEWED,
      properties: {},
    });
  };

  private handleTrackMailSentInvoiceEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_INVOICE_MAIL_SENT,
      properties: {},
    });
  };
}
