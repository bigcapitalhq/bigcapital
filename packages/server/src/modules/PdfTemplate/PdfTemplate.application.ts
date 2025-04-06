import { Injectable } from '@nestjs/common';
import { ICreateInvoicePdfTemplateDTO, IEditPdfTemplateDTO } from './types';
import { CreatePdfTemplateService } from './commands/CreatePdfTemplate.service';
import { DeletePdfTemplateService } from './commands/DeletePdfTemplate.service';
import { GetPdfTemplateService } from './queries/GetPdfTemplate.service';
import { EditPdfTemplateService } from './commands/EditPdfTemplate.service';
import { AssignPdfTemplateDefaultService } from './commands/AssignPdfTemplateDefault.service';
import { GetOrganizationBrandingAttributesService } from './queries/GetOrganizationBrandingAttributes.service';

@Injectable()
export class PdfTemplateApplication {
  constructor(
    private readonly createPdfTemplateService: CreatePdfTemplateService,
    private readonly getPdfTemplateService: GetPdfTemplateService,
    private readonly deletePdfTemplateService: DeletePdfTemplateService,
    // private readonly getPdfTemplatesService: GetPdfTemplatesService,
    private readonly editPdfTemplateService: EditPdfTemplateService,
    private readonly assignPdfTemplateDefaultService: AssignPdfTemplateDefaultService,
    // private readonly getPdfTemplateBrandingStateService: GetPdfTemplateBrandingStateService,
    // private readonly getOrganizationBrandingAttributesService: GetOrganizationBrandingAttributesService,
  ) {}

  /**
   * Creates a new PDF template.
   * @param {string} templateName - The name of the PDF template to create.
   * @param {string} resource - The resource type associated with the PDF template.
   * @param {ICreateInvoicePdfTemplateDTO} invoiceTemplateDTO - The data transfer object containing the details for the new PDF template.
   * @returns {Promise<any>}
   */
  public async createPdfTemplate(
    templateName: string,
    resource: string,
    invoiceTemplateDTO: ICreateInvoicePdfTemplateDTO,
  ) {
    return this.createPdfTemplateService.createPdfTemplate(
      templateName,
      resource,
      invoiceTemplateDTO,
    );
  }

  /**
   * Deletes a PDF template.
   * @param {number} templateId - The ID of the template to delete.
   */
  public async deletePdfTemplate(templateId: number) {
    return this.deletePdfTemplateService.deletePdfTemplate(templateId);
  }

  /**
   * Retrieves a specific PDF template.
   * @param {number} templateId - The ID of the template to retrieve.
   */
  public async getPdfTemplate(templateId: number) {
    return this.getPdfTemplateService.getPdfTemplate(templateId);
  }

  /**
   * Retrieves all PDF templates.
   * @param {string} resource - The resource type to filter templates.
   */
  public async getPdfTemplates(resource: string) {
    // return this.getPdfTemplatesService.execute(resource);
  }

  /**
   * Edits an existing PDF template.
   * @param {number} templateId - The ID of the template to edit.
   * @param {IEditPdfTemplateDTO} editDTO - The data transfer object containing the updates.
   */
  public async editPdfTemplate(
    templateId: number,
    editDTO: IEditPdfTemplateDTO,
  ) {
    return this.editPdfTemplateService.editPdfTemplate(templateId, editDTO);
  }

  /**
   * Gets the PDF template branding state.
   * @param {number} tenantId - The tenant ID.
   */
  public async getPdfTemplateBrandingState(tenantId: number) {
    // return this.getPdfTemplateBrandingStateService.execute(tenantId);
  }

  /**
   * Assigns a PDF template as the default template.
   * @param {number} templateId - The ID of the PDF template to assign as default.
   * @returns {Promise<any>}
   */
  public async assignPdfTemplateAsDefault(templateId: number) {
    return this.assignPdfTemplateDefaultService.assignDefaultTemplate(
      templateId,
    );
  }
}
