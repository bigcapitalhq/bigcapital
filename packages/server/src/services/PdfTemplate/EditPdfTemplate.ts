import { Inject, Service } from 'typedi';
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
   * @param {number} templateId
   * @param {IEditPdfTemplateDTO} editTemplateDTO
   */
  public editPdfTemplate(
    tenantId: number,
    templateId: number,
    editTemplateDTO: IEditPdfTemplateDTO
  ) {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    return this.uow.withTransaction(tenantId, async (trx) => {
      await PdfTemplate.query(trx)
        .patch({
          ...editTemplateDTO,
        })
        .where('id', templateId);

      await this.eventPublisher.emitAsync(events.pdfTemplate.onEdited, {
        tenantId,
        templateId,
      });
    });
  }
}
