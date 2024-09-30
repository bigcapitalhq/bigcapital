import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '../ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '../TemplateInjectable/TemplateInjectable';
import GetCreditNote from './GetCreditNote';
import { CreditNoteBrandingTemplate } from './CreditNoteBrandingTemplate';
import { CreditNotePdfTemplateAttributes } from '@/interfaces';
import HasTenancyService from '../Tenancy/TenancyService';
import { transformCreditNoteToPdfTemplate } from './utils';

@Service()
export default class GetCreditNotePdf {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private getCreditNoteService: GetCreditNote;

  @Inject()
  private creditNoteBrandingTemplate: CreditNoteBrandingTemplate;

  /**
   * Retrieves sale invoice pdf content.
   * @param {number} tenantId - Tenant id.
   * @param {number} creditNoteId - Credit note id.
   */
  public async getCreditNotePdf(tenantId: number, creditNoteId: number) {
    const brandingAttributes = await this.getCreditNoteBrandingAttributes(
      tenantId,
      creditNoteId
    );
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/credit-note-standard',
      brandingAttributes
    );
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent);
  }

  /**
   * Retrieves credit note branding attributes.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} creditNoteId - The ID of the credit note.
   * @returns {Promise<CreditNotePdfTemplateAttributes>} The credit note branding attributes.
   */
  public async getCreditNoteBrandingAttributes(
    tenantId: number,
    creditNoteId: number
  ): Promise<CreditNotePdfTemplateAttributes> {
    const { PdfTemplate } = this.tenancy.models(tenantId);
    const creditNote = await this.getCreditNoteService.getCreditNote(
      tenantId,
      creditNoteId
    );
    // Retrieve the invoice template id of not found get the default template id.
    const templateId =
      creditNote.pdfTemplateId ??
      (
        await PdfTemplate.query().findOne({
          resource: 'CreditNote',
          default: true,
        })
      )?.id;
    // Retrieves the credit note branding template.
    const brandingTemplate =
      await this.creditNoteBrandingTemplate.getCreditNoteBrandingTemplate(
        tenantId,
        templateId
      );
    return {
      ...brandingTemplate.attributes,
      ...transformCreditNoteToPdfTemplate(creditNote),
    };
  }
}
