import { Inject } from "typedi";
import { GetPdfTemplate } from "../PdfTemplate/GetPdfTemplate";
import { defaultCreditNoteBrandingAttributes } from "./constants";
import { mergePdfTemplateWithDefaultAttributes } from "../Sales/Invoices/utils";

export class CreditNoteBrandingTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

  /**
   * Retrieves the credit note branding template.
   * @param {number} tenantId 
   * @param {number} templateId 
   * @returns {}
   */
  public async getCreditNoteBrandingTemplate(tenantId: number, templateId: number) {
    const template = await this.getPdfTemplateService.getPdfTemplate(
      tenantId,
      templateId
    );
    const attributes = mergePdfTemplateWithDefaultAttributes(
      template.attributes,
      defaultCreditNoteBrandingAttributes
    );
    return {
      ...template,
      attributes,
    };
  }
}
