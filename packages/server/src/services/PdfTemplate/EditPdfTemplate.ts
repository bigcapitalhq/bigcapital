import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IEditPdfTemplateDTO } from './types';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class EditPdfTemplate {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Edits an existing pdf template.
   * @param {number} tenantId
   * @param {number} templateId - Template id.
   * @param {IEditPdfTemplateDTO} editTemplateDTO
   */
  public async editPdfTemplate(
    tenantId: number,
    templateId: number,
    editTemplateDTO: IEditPdfTemplateDTO
  ) {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const oldPdfTemplate = await PdfTemplate.query()
      .findById(templateId)
      .throwIfNotFound();

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onPdfTemplateEditing` event.
      await this.eventPublisher.emitAsync(events.pdfTemplate.onEditing, {
        tenantId,
        templateId,
      });
      const pdfTemplate = await PdfTemplate.query(trx)
        .where('id', templateId)
        .update({
          templateName: editTemplateDTO.templateName,
          attributes: editTemplateDTO.attributes,
        });

      // Triggers `onPdfTemplatedEdited` event.
      await this.eventPublisher.emitAsync(events.pdfTemplate.onEdited, {
        tenantId,
        templateId,
      });
      return pdfTemplate;
    });
  }
}
