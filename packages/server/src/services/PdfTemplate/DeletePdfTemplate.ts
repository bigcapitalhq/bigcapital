import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

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
   * @param {number} templateId
   */
  public deletePdfTemplate(tenantId: number, templateId: number) {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    return this.uow.withTransaction(tenantId, async (trx) => {
      // Triggers `onPdfTemplateDeleting` event.
      await this.eventPublisher.emitAsync(events.pdfTemplate.onDeleting, {
        tenantId,
        templateId,
      });
      await PdfTemplate.query(trx).deleteById(templateId);

      // Triggers `onPdfTemplateDeleted` event.
      await this.eventPublisher.emitAsync(events.pdfTemplate.onDeleted, {
        tenantId,
        templateId,
      });
    });
  }
}
