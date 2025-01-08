import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceEditedPayload,
} from '../../SaleInvoices/SaleInvoice.types';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  SALE_INVOICE_CREATED,
  SALE_INVOICE_DELETED,
  SALE_INVOICE_EDITED,
  SALE_INVOICE_MAIL_SENT,
  SALE_INVOICE_PDF_VIEWED,
  SALE_INVOICE_VIEWED,
} from '../event-tracker';

@Injectable()
export class SaleInvoiceEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.saleInvoice.onCreated)
  public handleTrackInvoiceCreatedEvent({}: ISaleInvoiceCreatedPayload) {
    this.posthog.trackEvent({
      event: SALE_INVOICE_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.saleInvoice.onEdited)
  public handleTrackEditedInvoiceEvent({}: ISaleInvoiceEditedPayload) {
    this.posthog.trackEvent({
      event: SALE_INVOICE_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.saleInvoice.onDeleted)
  public handleTrackDeletedInvoiceEvent({}: ISaleInvoiceEditedPayload) {
    this.posthog.trackEvent({
      event: SALE_INVOICE_DELETED,
      properties: {},
    });
  }

  @OnEvent(events.saleInvoice.onViewed)
  public handleTrackViewedInvoiceEvent({}) {
    this.posthog.trackEvent({
      event: SALE_INVOICE_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.saleInvoice.onPdfViewed)
  public handleTrackPdfViewedInvoiceEvent({}) {
    this.posthog.trackEvent({
      event: SALE_INVOICE_PDF_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.saleInvoice.onMailSent)
  public handleTrackMailSentInvoiceEvent({}) {
    this.posthog.trackEvent({
      event: SALE_INVOICE_MAIL_SENT,
      properties: {},
    });
  }
}
