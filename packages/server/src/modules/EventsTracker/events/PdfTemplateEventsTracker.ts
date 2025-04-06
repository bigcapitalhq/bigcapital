import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  PDF_TEMPLATE_CREATED,
  PDF_TEMPLATE_EDITED,
  PDF_TEMPLATE_DELETED,
  PDF_TEMPLATE_ASSIGNED_DEFAULT,
} from '../event-tracker';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';

@Injectable()
export class PdfTemplateEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.pdfTemplate.onCreated)
  public handleTrackPdfTemplateCreatedEvent({}) {
    this.posthog.trackEvent({
      event: PDF_TEMPLATE_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.pdfTemplate.onEdited)
  public handleTrackEditedPdfTemplateEvent({}) {
    this.posthog.trackEvent({
      event: PDF_TEMPLATE_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.pdfTemplate.onDeleted)
  public handleTrackDeletedPdfTemplateEvent({}) {
    this.posthog.trackEvent({
      event: PDF_TEMPLATE_DELETED,
      properties: {},
    });
  }

  @OnEvent(events.pdfTemplate.onAssignedDefault)
  public handleTrackAssignedAsDefaultPdfTemplateEvent({}) {
    this.posthog.trackEvent({
      event: PDF_TEMPLATE_ASSIGNED_DEFAULT,
      properties: {},
    });
  }
}
