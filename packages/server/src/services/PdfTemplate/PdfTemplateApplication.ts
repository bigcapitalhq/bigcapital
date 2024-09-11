import { Inject, Service } from 'typedi';
import { ICreateInvoicePdfTemplateDTO } from './types';
import { CreatePdfTemplate } from './CreatePdfTemplate';
import { DeletePdfTemplate } from './DeletePdfTemplate';
import { GetPdfTemplate } from './GetPdfTemplate';
import { GetPdfTemplates } from './GetPdfTemplates';
import { EditPdfTemplate } from './EditPdfTemplate';

@Service()
export class PdfTemplateApplication {
  @Inject()
  private createPdfTemplateService: CreatePdfTemplate;

  @Inject()
  private deletePdfTemplateService: DeletePdfTemplate;

  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

  @Inject()
  private getPdfTemplatesService: GetPdfTemplates;

  @Inject()
  private editPdfTemplateService: EditPdfTemplate;

  public async createPdfTemplate(
    tenantId: number,
    templateName: string,
    invoiceTemplateDTO: ICreateInvoicePdfTemplateDTO
  ) {
    return this.createPdfTemplateService.createPdfTemplate(
      tenantId,
      templateName,
      invoiceTemplateDTO
    );
  }

  public async editPdfTemplate(
    tenantId: number,
    templateId: number,
    editTemplateDTO: IEditPdfTemplateDTO
  ) {
    return this.editPdfTemplateService.editPdfTemplate(
      tenantId,
      templateId,
      editTemplateDTO
    );
  }

  public async deletePdfTemplate(tenantId: number, templateId: number) {
    return this.deletePdfTemplateService.deletePdfTemplate(
      tenantId,
      templateId
    );
  }

  public async getPdfTemplate(tenantId: number, templateId: number) {
    return this.getPdfTemplateService.getPdfTemplate(tenantId, templateId);
  }

  public async getPdfTemplates(
    tenantId: number,
    query?: { resource?: string }
  ) {
    return this.getPdfTemplatesService.getPdfTemplates(tenantId, query);
  }
}
