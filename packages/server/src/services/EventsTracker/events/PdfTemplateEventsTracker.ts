import { Inject, Service } from 'typedi';
import {
  PDF_TEMPLATE_CREATED,
  PDF_TEMPLATE_EDITED,
  PDF_TEMPLATE_DELETED,
  PDF_TEMPLATE_ASSIGNED_DEFAULT,
} from '@/constants/event-tracker';
import { PosthogService } from '../PostHog';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class PdfTemplateEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  public attach(bus) {
    bus.subscribe(
      events.pdfTemplate.onCreated,
      this.handleTrackPdfTemplateCreatedEvent
    );
    bus.subscribe(
      events.pdfTemplate.onEdited,
      this.handleTrackEditedPdfTemplateEvent
    );
    bus.subscribe(
      events.pdfTemplate.onDeleted,
      this.handleTrackDeletedPdfTemplateEvent
    );
    bus.subscribe(
      events.pdfTemplate.onAssignedDefault,
      this.handleTrackAssignedAsDefaultPdfTemplateEvent
    );
  }

  private handleTrackPdfTemplateCreatedEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PDF_TEMPLATE_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedPdfTemplateEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PDF_TEMPLATE_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedPdfTemplateEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PDF_TEMPLATE_DELETED,
      properties: {},
    });
  };

  private handleTrackAssignedAsDefaultPdfTemplateEvent = ({ tenantId }) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PDF_TEMPLATE_ASSIGNED_DEFAULT,
      properties: {},
    });
  };
}
