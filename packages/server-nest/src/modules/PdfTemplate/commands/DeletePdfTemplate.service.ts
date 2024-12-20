import { Inject, Injectable } from '@nestjs/common';
import { ERRORS } from '../types';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ServiceError } from '../../Items/ServiceError';
import { PdfTemplateModel } from '../models/PdfTemplate';

@Injectable()
export class DeletePdfTemplateService {
  constructor(
    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: typeof PdfTemplateModel,
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Deletes a pdf template.
   * @param {number} templateId - Pdf template id.
   */
  public async deletePdfTemplate(templateId: number) {
    const oldPdfTemplate = await this.pdfTemplateModel.query()
      .findById(templateId)
      .throwIfNotFound();

    // Cannot delete the predefined pdf templates.
    if (oldPdfTemplate.predefined) {
      throw new ServiceError(ERRORS.CANNOT_DELETE_PREDEFINED_PDF_TEMPLATE);
    }

    return this.uow.withTransaction(async (trx) => {
      // Triggers `onPdfTemplateDeleting` event.
      await this.eventEmitter.emitAsync(events.pdfTemplate.onDeleting, {
        templateId,
        oldPdfTemplate,
        trx,
      });
      await this.pdfTemplateModel.query(trx).deleteById(templateId);

      // Triggers `onPdfTemplateDeleted` event.
      await this.eventEmitter.emitAsync(events.pdfTemplate.onDeleted, {
        templateId,
        oldPdfTemplate,
        trx,
      });
    });
  }
}
