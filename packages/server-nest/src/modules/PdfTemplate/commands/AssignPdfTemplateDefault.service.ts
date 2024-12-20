import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PdfTemplateModel } from '../models/PdfTemplate';
import { events } from '@/common/events/events';

@Injectable()
export class AssignPdfTemplateDefaultService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: typeof PdfTemplateModel,
  ) {}

  /**
   * Assigns a default PDF template.
   * @param {number} templateId - The ID of the template to be set as the default.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {Error} Throws an error if the specified template is not found.
   */
  public async assignDefaultTemplate(templateId: number) {
    const oldPdfTemplate = await this.pdfTemplateModel.query()
      .findById(templateId)
      .throwIfNotFound();

    return this.uow.withTransaction(
      async (trx?: Knex.Transaction) => {
        // Triggers `onPdfTemplateAssigningDefault` event.
        await this.eventPublisher.emitAsync(
          events.pdfTemplate.onAssigningDefault,
          {
            templateId,
          }
        );
        await this.pdfTemplateModel.query(trx)
          .where('resource', oldPdfTemplate.resource)
          .patch({ default: false });

        await this.pdfTemplateModel.query(trx)
          .findById(templateId)
          .patch({ default: true });

        // Triggers `onPdfTemplateAssignedDefault` event.
        await this.eventPublisher.emitAsync(
          events.pdfTemplate.onAssignedDefault,
          {
            templateId,
          }
        );
      }
    );
  }
}
