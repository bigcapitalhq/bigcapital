import { Inject, Service } from 'typedi';
import { ICreateInvoicePdfTemplateDTO, IEditPdfTemplateDTO } from './types';
import { CreatePdfTemplate } from './CreatePdfTemplate';
import { DeletePdfTemplate } from './DeletePdfTemplate';
import { GetPdfTemplate } from './GetPdfTemplate';
import { GetPdfTemplates } from './GetPdfTemplates';
import { EditPdfTemplate } from './EditPdfTemplate';
import { AssignPdfTemplateDefault } from './AssignPdfTemplateDefault';
import { GetPdfTemplateBrandingState } from './GetPdfTemplateBrandingState';

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

  @Inject()
  private assignPdfTemplateDefaultService: AssignPdfTemplateDefault;

  @Inject()
  private getPdfTemplateBrandingStateService: GetPdfTemplateBrandingState;

  /**
   * Creates a new PDF template.
   * @param {number} tenantId -
   * @param {string} templateName - The name of the PDF template to create.
   * @param {string} resource - The resource type associated with the PDF template.
   * @param {ICreateInvoicePdfTemplateDTO} invoiceTemplateDTO - The data transfer object containing the details for the new PDF template.
   * @returns {Promise<any>}
   */
  public async createPdfTemplate(
    tenantId: number,
    templateName: string,
    resource: string,
    invoiceTemplateDTO: ICreateInvoicePdfTemplateDTO
  ) {
    return this.createPdfTemplateService.createPdfTemplate(
      tenantId,
      templateName,
      resource,
      invoiceTemplateDTO
    );
  }

  /**
   * Edits an existing PDF template.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} templateId - The ID of the PDF template to edit.
   * @param {IEditPdfTemplateDTO} editTemplateDTO - The data transfer object containing the updated details for the PDF template.
   * @returns {Promise<any>}
   */
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

  /**
   * Deletes a PDF template.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} templateId - The ID of the PDF template to delete.
   * @returns {Promise<any>}
   */

  public async deletePdfTemplate(tenantId: number, templateId: number) {
    return this.deletePdfTemplateService.deletePdfTemplate(
      tenantId,
      templateId
    );
  }

  /**
   * Retrieves a PDF template by its ID for a specified tenant.
   * @param {number} tenantId -
   * @param {number} templateId - The ID of the PDF template to retrieve.
   * @returns {Promise<any>}
   */
  public async getPdfTemplate(tenantId: number, templateId: number) {
    return this.getPdfTemplateService.getPdfTemplate(tenantId, templateId);
  }

  /**
   * Retrieves a list of PDF templates.
   * @param {number} tenantId - The ID of the tenant for which to retrieve templates.
   * @param {Object} query
   * @returns {Promise<any>}
   */
  public async getPdfTemplates(
    tenantId: number,
    query?: { resource?: string }
  ) {
    return this.getPdfTemplatesService.getPdfTemplates(tenantId, query);
  }

  /**
   * Assigns a PDF template as the default template.
   * @param {number} tenantId
   * @param {number} templateId - The ID of the PDF template to assign as default.
   * @returns {Promise<any>}
   */
  public async assignPdfTemplateAsDefault(
    tenantId: number,
    templateId: number
  ) {
    return this.assignPdfTemplateDefaultService.assignDefaultTemplate(
      tenantId,
      templateId
    );
  }

  /**
   * 
   * @param {number} tenantId 
   */
  public async getPdfTemplateBrandingState(tenantId: number) {
    return this.getPdfTemplateBrandingStateService.getBrandingState(tenantId);
  }
}
