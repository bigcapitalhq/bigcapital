import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ISaleEstimateCreatedPayload,
  ISaleEstimateEditedPayload,
  ISaleEstimateDeletedPayload,
} from '../../SaleEstimates/types/SaleEstimates.types';
import { EventTrackerService } from '../EventTracker.service';
import {
  SALE_ESTIMATE_CREATED,
  SALE_ESTIMATE_EDITED,
  SALE_ESTIMATE_DELETED,
  SALE_ESTIMATE_PDF_VIEWED,
  SALE_ESTIMATE_VIEWED,
  SALE_ESTIMATE_MAIL_SENT,
} from '../event-tracker';
import { events } from '@/common/events/events';

@Injectable()
export class SaleEstimateEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.saleEstimate.onCreated)
  public handleTrackEstimateCreatedEvent({}: ISaleEstimateCreatedPayload) {
    this.posthog.trackEvent({
      event: SALE_ESTIMATE_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.saleEstimate.onEdited)
  public handleTrackEditedEstimateEvent({}: ISaleEstimateEditedPayload) {
    this.posthog.trackEvent({
      event: SALE_ESTIMATE_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.saleEstimate.onDeleted)
  public handleTrackDeletedEstimateEvent({}: ISaleEstimateDeletedPayload) {
    this.posthog.trackEvent({
      event: SALE_ESTIMATE_DELETED,
      properties: {},
    });
  }

  @OnEvent(events.saleEstimate.onPdfViewed)
  public handleTrackPdfViewedEstimateEvent({}: ISaleEstimateDeletedPayload) {
    this.posthog.trackEvent({
      event: SALE_ESTIMATE_PDF_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.saleEstimate.onViewed)
  public handleTrackViewedEstimateEvent({}) {
    this.posthog.trackEvent({
      event: SALE_ESTIMATE_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.saleEstimate.onMailSent)
  public handleTrackMailSentEstimateEvent({}) {
    this.posthog.trackEvent({
      event: SALE_ESTIMATE_MAIL_SENT,
      properties: {},
    });
  }
}
