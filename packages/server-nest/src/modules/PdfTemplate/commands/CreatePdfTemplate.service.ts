import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ICreateInvoicePdfTemplateDTO } from '../types';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { PdfTemplateModel } from '../models/PdfTemplate';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CreatePdfTemplateService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,

    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: TenantModelProxy<
      typeof PdfTemplateModel
    >,
  ) {}

  /**
   * Creates a new pdf template.
   * @param {string} templateName - Pdf template name.
   * @param {string} resource - Pdf template resource.
   * @param {ICreateInvoicePdfTemplateDTO} invoiceTemplateDTO - Invoice template data.
   */
  public createPdfTemplate(
    templateName: string,
    resource: string,
    invoiceTemplateDTO: ICreateInvoicePdfTemplateDTO,
  ) {
    const attributes = invoiceTemplateDTO;

    return this.uow.withTransaction(async (trx) => {
      // Triggers `onPdfTemplateCreating` event.
      await this.eventEmitter.emitAsync(events.pdfTemplate.onCreating, {});

      const pdfTemplate = await this.pdfTemplateModel().query(trx).insert({
        templateName,
        resource,
        attributes,
      });

      // Triggers `onPdfTemplateCreated` event.
      await this.eventEmitter.emitAsync(events.pdfTemplate.onCreated, {});

      return pdfTemplate;
    });
  }
}
