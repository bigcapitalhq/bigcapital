import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  ISaleEstimateCreatedPayload,
  ISaleEstimateEditedPayload,
  ISaleEstimateDeletedPayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  SALE_ESTIMATE_CREATED,
  SALE_ESTIMATE_EDITED,
  SALE_ESTIMATE_DELETED,
  SALE_ESTIMATE_PDF_VIEWED,
  SALE_ESTIMATE_VIEWED,
  SALE_ESTIMATE_MAIL_SENT,
} from '@/constants/event-tracker';

@Service()
export class SaleEstimateEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleEstimate.onCreated,
      this.handleTrackEstimateCreatedEvent
    );
    bus.subscribe(
      events.saleEstimate.onEdited,
      this.handleTrackEditedEstimateEvent
    );
    bus.subscribe(
      events.saleEstimate.onDeleted,
      this.handleTrackDeletedEstimateEvent
    );
    bus.subscribe(
      events.saleEstimate.onPdfViewed,
      this.handleTrackPdfViewedEstimateEvent
    );
    bus.subscribe(
      events.saleEstimate.onViewed,
      this.handleTrackViewedEstimateEvent
    );
    bus.subscribe(
      events.saleEstimate.onMailSent,
      this.handleTrackMailSentEstimateEvent
    );
  }

  private handleTrackEstimateCreatedEvent = ({
    tenantId,
  }: ISaleEstimateCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_ESTIMATE_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedEstimateEvent = ({
    tenantId,
  }: ISaleEstimateEditedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_ESTIMATE_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedEstimateEvent = ({
    tenantId,
  }: ISaleEstimateDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_ESTIMATE_DELETED,
      properties: {},
    });
  };

  private handleTrackPdfViewedEstimateEvent = ({
    tenantId,
  }: ISaleEstimateDeletedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_ESTIMATE_PDF_VIEWED,
      properties: {},
    });
  };

  private handleTrackViewedEstimateEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_ESTIMATE_VIEWED,
      properties: {},
    });
  };

  private handleTrackMailSentEstimateEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALE_ESTIMATE_MAIL_SENT,
      properties: {},
    });
  };
}
