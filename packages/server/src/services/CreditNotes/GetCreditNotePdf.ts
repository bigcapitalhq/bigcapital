import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '../ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '../TemplateInjectable/TemplateInjectable';
import GetCreditNote from './GetCreditNote';
import { CreditNoteBrandingTemplate } from './CreditNoteBrandingTemplate';
import { CreditNotePdfTemplateAttributes } from '@/interfaces';
import HasTenancyService from '../Tenancy/TenancyService';
import { transformCreditNoteToPdfTemplate } from './utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

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

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Retrieves sale invoice pdf content.
   * @param {number} tenantId - Tenant id.
   * @param {number} creditNoteId - Credit note id.
   * @returns {Promise<[Buffer, string]>}
   */
  public async getCreditNotePdf(
    tenantId: number,
    creditNoteId: number
  ): Promise<[Buffer, string]> {
    const brandingAttributes = await this.getCreditNoteBrandingAttributes(
      tenantId,
      creditNoteId
    );
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/credit-note-standard',
      brandingAttributes
    );
    const filename = await this.getCreditNoteFilename(tenantId, creditNoteId);

    const document = await this.chromiumlyTenancy.convertHtmlContent(
      tenantId,
      htmlContent
    );
    const eventPayload = { tenantId, creditNoteId };

    // Triggers the `onCreditNotePdfViewed` event.
    await this.eventPublisher.emitAsync(
      events.creditNote.onPdfViewed,
      eventPayload
    );
    return [document, filename];
  }

  /**
   * Retrieves the filename pdf document of the given credit note.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<string>}
   */
  public async getCreditNoteFilename(
    tenantId: number,
    creditNoteId: number
  ): Promise<string> {
    const { CreditNote } = this.tenancy.models(tenantId);

    const creditNote = await CreditNote.query().findById(creditNoteId);

    return `Credit-${creditNote.creditNoteNumber}`;
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
