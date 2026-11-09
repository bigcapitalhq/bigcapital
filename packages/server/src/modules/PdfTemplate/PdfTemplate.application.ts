import { Injectable } from '@nestjs/common';
import {
  CreatePdfTemplateDto,
  EditPdfTemplateDto,
} from './dtos/PdfTemplate.dto';
import { CreatePdfTemplateService } from './commands/CreatePdfTemplate.service';
import { DeletePdfTemplateService } from './commands/DeletePdfTemplate.service';
import { GetPdfTemplateService } from './queries/GetPdfTemplate.service';
import { EditPdfTemplateService } from './commands/EditPdfTemplate.service';
import { AssignPdfTemplateDefaultService } from './commands/AssignPdfTemplateDefault.service';
import { GetOrganizationBrandingAttributesService } from './queries/GetOrganizationBrandingAttributes.service';
import { GetPdfTemplates } from './queries/GetPdfTemplates.service';
import { GetPdfTemplateBrandingState } from './queries/GetPdfTemplateBrandingState.service';

@Injectable()
export class PdfTemplateApplication {
  constructor(
    private readonly createPdfTemplateService: CreatePdfTemplateService,
    private readonly getPdfTemplateService: GetPdfTemplateService,
    private readonly deletePdfTemplateService: DeletePdfTemplateService,
    private readonly getPdfTemplatesService: GetPdfTemplates,
    private readonly editPdfTemplateService: EditPdfTemplateService,
    private readonly assignPdfTemplateDefaultService: AssignPdfTemplateDefaultService,
    private readonly getPdfTemplateBrandingStateService: GetPdfTemplateBrandingState,
    private readonly getOrganizationBrandingAttributesService: GetOrganizationBrandingAttributesService,
  ) {}

  /**
   * Creates a new PDF template.
   * @param {CreatePdfTemplateDto} createDTO - The data transfer object containing the details for the new PDF template.
   * @returns {Promise<any>}
   */
  public createPdfTemplate(createDTO: CreatePdfTemplateDto) {
    return this.createPdfTemplateService.createPdfTemplate(createDTO);
  }

  /**
   * Deletes a PDF template.
   * @param {number} templateId - The ID of the template to delete.
   */
  public deletePdfTemplate(templateId: number) {
    return this.deletePdfTemplateService.deletePdfTemplate(templateId);
  }

  /**
   * Retrieves a specific PDF template.
   * @param {number} templateId - The ID of the template to retrieve.
   */
  public getPdfTemplate(templateId: number) {
    return this.getPdfTemplateService.getPdfTemplate(templateId);
  }

  /**
   * Retrieves all PDF templates.
   * @param {string} resource - The resource type to filter templates.
   */
  public getPdfTemplates(query?: { resource?: string }) {
    return this.getPdfTemplatesService.getPdfTemplates(query);
  }

  /**
   * Edits an existing PDF template.
   * @param {number} templateId - The ID of the template to edit.
   * @param {EditPdfTemplateDto} editDTO - The data transfer object containing the updates.
   */
  public editPdfTemplate(templateId: number, editDTO: EditPdfTemplateDto) {
    return this.editPdfTemplateService.editPdfTemplate(templateId, editDTO);
  }

  /**
   * Gets the PDF template branding state.
   */
  public getPdfTemplateBrandingState() {
    return this.getPdfTemplateBrandingStateService.execute();
  }

  /**
   * Assigns a PDF template as the default template.
   * @param {number} templateId - The ID of the PDF template to assign as default.
   * @returns {Promise<any>}
   */
  public assignPdfTemplateAsDefault(templateId: number) {
    return this.assignPdfTemplateDefaultService.assignDefaultTemplate(
      templateId,
    );
  }

  /**
   * Retrieves the organization branding attributes.
   * @returns {Promise<CommonOrganizationBrandingAttributes>} The organization branding attributes.
   */
  public getOrganizationBrandingAttributes() {
    return this.getOrganizationBrandingAttributesService.execute();
  }
}
