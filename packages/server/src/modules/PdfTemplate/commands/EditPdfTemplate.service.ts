import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EditPdfTemplateDto } from '../dtos/PdfTemplate.dto';
import { sanitizePdfTemplateAttributes } from '../utils/sanitizePdfTemplateAttributes';
import { PdfTemplateModel } from '../models/PdfTemplate';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class EditPdfTemplateService {
  constructor(
    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: TenantModelProxy<
      typeof PdfTemplateModel
    >,
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Edits an existing pdf template.
   * @param {number} templateId - Template id.
   * @param {EditPdfTemplateDto} editTemplateDTO
   */
  public async editPdfTemplate(
    templateId: number,
    editTemplateDTO: EditPdfTemplateDto,
  ) {
    const oldPdfTemplate = await this.pdfTemplateModel()
      .query()
      .findById(templateId)
      .throwIfNotFound();

    const sanitizedAttributes = sanitizePdfTemplateAttributes(
      editTemplateDTO.attributes,
    );

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onPdfTemplateEditing` event.
      await this.eventEmitter.emitAsync(events.pdfTemplate.onEditing, {
        templateId,
      });

      const pdfTemplate = await this.pdfTemplateModel()
        .query(trx)
        .where('id', templateId)
        .update({
          templateName: editTemplateDTO.templateName,
          attributes: sanitizedAttributes,
        });

      // Triggers `onPdfTemplatedEdited` event.
      await this.eventEmitter.emitAsync(events.pdfTemplate.onEdited, {
        templateId,
      });
      return pdfTemplate;
    });
  }
}
