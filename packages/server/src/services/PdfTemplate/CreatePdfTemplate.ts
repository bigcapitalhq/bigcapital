import { Inject, Service } from 'typedi';
import { ICreateInvoicePdfTemplateDTO } from './types';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class CreatePdfTemplate {
  @Inject()
  private tennacy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Creates a new pdf template.
   * @param {number} tenantId
   * @param {ICreateInvoicePdfTemplateDTO} invoiceTemplateDTO
   */
  public createPdfTemplate(
    tenantId: number,
    templateName: string,
    resource: string,
    invoiceTemplateDTO: ICreateInvoicePdfTemplateDTO
  ) {
    const { PdfTemplate } = this.tennacy.models(tenantId);
    const attributes = invoiceTemplateDTO;

    return this.uow.withTransaction(tenantId, async (trx) => {
      // Triggers `onPdfTemplateCreating` event.
      await this.eventPublisher.emitAsync(events.pdfTemplate.onCreating, {
        tenantId,
      });

      const pdfTemplate = await PdfTemplate.query(trx).insert({
        templateName,
        resource,
        attributes,
      });
      // Triggers `onPdfTemplateCreated` event.
      await this.eventPublisher.emitAsync(events.pdfTemplate.onCreated, {
        tenantId,
      });
      return pdfTemplate;
    });
  }
}
