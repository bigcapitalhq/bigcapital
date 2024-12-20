import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { IEditPdfTemplateDTO } from '../types';
import { PdfTemplateModel } from '../models/PdfTemplate';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class EditPdfTemplateService {
  constructor(
    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: typeof PdfTemplateModel,
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Edits an existing pdf template.
   * @param {number} templateId - Template id.
   * @param {IEditPdfTemplateDTO} editTemplateDTO
   */
  public async editPdfTemplate(
    templateId: number,
    editTemplateDTO: IEditPdfTemplateDTO
  ) {
    const oldPdfTemplate = await this.pdfTemplateModel.query()
      .findById(templateId)
      .throwIfNotFound();

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onPdfTemplateEditing` event.
      await this.eventEmitter.emitAsync(events.pdfTemplate.onEditing, {
        templateId,
      });

      const pdfTemplate = await this.pdfTemplateModel.query(trx)
        .where('id', templateId)
        .update({
          templateName: editTemplateDTO.templateName,
          attributes: editTemplateDTO.attributes,
        });

      // Triggers `onPdfTemplatedEdited` event.
      await this.eventEmitter.emitAsync(events.pdfTemplate.onEdited, {
        templateId,
      });
      return pdfTemplate;
    });
  }
}
