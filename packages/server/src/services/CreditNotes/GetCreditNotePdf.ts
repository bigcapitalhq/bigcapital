import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '../ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '../TemplateInjectable/TemplateInjectable';
import GetCreditNote from './GetCreditNote';

@Service()
export default class GetCreditNotePdf {
  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private getCreditNoteService: GetCreditNote;

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId - Tenant id.
   * @param {number} creditNoteId - Credit note id.
   */
  public async getCreditNotePdf(tenantId: number, creditNoteId: number) {
    const creditNote = await this.getCreditNoteService.getCreditNote(
      tenantId,
      creditNoteId
    );
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/credit-note-standard',
      {
        creditNote,
      }
    );
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent, {
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });
  }
}
