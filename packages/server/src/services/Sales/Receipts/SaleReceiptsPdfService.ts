import { Inject, Service } from 'typedi';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { GetSaleReceipt } from './GetSaleReceipt';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SaleReceiptBrandingTemplate } from './SaleReceiptBrandingTemplate';
import { transformReceiptToBrandingTemplateAttributes } from './utils';
import { ISaleReceiptBrandingTemplateAttributes } from '@/interfaces';

@Service()
export class SaleReceiptsPdf {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private getSaleReceiptService: GetSaleReceipt;

  @Inject()
  private saleReceiptBrandingTemplate: SaleReceiptBrandingTemplate;

  /**
   * Retrieves sale invoice pdf content.
   * @param {number} tenantId -
   * @param {number} saleInvoiceId -
   * @returns {Promise<Buffer>}
   */
  public async saleReceiptPdf(tenantId: number, saleReceiptId: number) {
    const brandingAttributes = await this.getReceiptBrandingAttributes(
      tenantId,
      saleReceiptId
    );
    // Converts the receipt template to html content.
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/receipt-regular',
      brandingAttributes
    );
    // Renders the html content to pdf document.
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent);
  }

  /**
   * Retrieves receipt branding attributes.
   * @param {number} tenantId
   * @param {number} receiptId
   * @returns {Promise<ISaleReceiptBrandingTemplateAttributes>}
   */
  public async getReceiptBrandingAttributes(
    tenantId: number,
    receiptId: number
  ): Promise<ISaleReceiptBrandingTemplateAttributes> {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const saleReceipt = await this.getSaleReceiptService.getSaleReceipt(
      tenantId,
      receiptId
    );
    // Retrieve the invoice template id of not found get the default template id.
    const templateId =
      saleReceipt.pdfTemplateId ??
      (
        await PdfTemplate.query().findOne({
          resource: 'SaleReceipt',
          default: true,
        })
      )?.id;
    // Retrieves the receipt branding template.
    const brandingTemplate =
      await this.saleReceiptBrandingTemplate.getSaleReceiptBrandingTemplate(
        tenantId,
        templateId
      );
    return {
      ...brandingTemplate.attributes,
      ...transformReceiptToBrandingTemplateAttributes(saleReceipt),
    };
  }
}
