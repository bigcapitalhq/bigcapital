import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './types';

@Service()
export class DeletePdfTemplate {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Deletes a pdf template.
   * @param {number} tenantId
   * @param {number} templateId - Pdf template id.
   */
  public async deletePdfTemplate(tenantId: number, templateId: number) {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const oldPdfTemplate = await PdfTemplate.query()
      .findById(templateId)
      .throwIfNotFound();

    // Cannot delete the predefined pdf templates.
    if (oldPdfTemplate.predefined) {
      throw new ServiceError(ERRORS.CANNOT_DELETE_PREDEFINED_PDF_TEMPLATE);
    }
    return this.uow.withTransaction(tenantId, async (trx) => {
      // Triggers `onPdfTemplateDeleting` event.
      await this.eventPublisher.emitAsync(events.pdfTemplate.onDeleting, {
        tenantId,
        templateId,
        oldPdfTemplate,
        trx,
      });
      await PdfTemplate.query(trx).deleteById(templateId);

      // Triggers `onPdfTemplateDeleted` event.
      await this.eventPublisher.emitAsync(events.pdfTemplate.onDeleted, {
        tenantId,
        templateId,
        oldPdfTemplate,
        trx,
      });
    });
  }
}
