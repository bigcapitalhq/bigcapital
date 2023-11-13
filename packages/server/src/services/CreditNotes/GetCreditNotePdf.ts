import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '../ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '../TemplateInjectable/TemplateInjectable';

@Service()
export default class GetCreditNotePdf {
  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  /**
   * Retrieve sale invoice pdf content.
   * @param {} saleInvoice -
   */
  public async getCreditNotePdf(tenantId: number, creditNote) {
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
