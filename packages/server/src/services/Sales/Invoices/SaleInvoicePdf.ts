import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { GetSaleInvoice } from './GetSaleInvoice';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { transformInvoiceToPdfTemplate } from './utils';
import { InvoicePdfTemplateAttributes } from '@/interfaces';
import { SaleInvoicePdfTemplate } from './SaleInvoicePdfTemplate';

@Service()
export class SaleInvoicePdf {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private getInvoiceService: GetSaleInvoice;

  @Inject()
  private invoiceBrandingTemplateService: SaleInvoicePdfTemplate;

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId - Tenant Id.
   * @param {ISaleInvoice} saleInvoice -
   * @returns {Promise<Buffer>}
   */
  public async saleInvoicePdf(
    tenantId: number,
    invoiceId: number
  ): Promise<Buffer> {
    const brandingAttributes = await this.getInvoiceBrandingAttributes(
      tenantId,
      invoiceId
    );
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/invoice-standard',
      brandingAttributes
    );
    // Converts the given html content to pdf document.
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent);
  }

  /**
   * Retrieves the branding attributes of the given sale invoice.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns {Promise<InvoicePdfTemplateAttributes>}
   */
  async getInvoiceBrandingAttributes(
    tenantId: number,
    invoiceId: number
  ): Promise<InvoicePdfTemplateAttributes> {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const invoice = await this.getInvoiceService.getSaleInvoice(
      tenantId,
      invoiceId
    );
    // Retrieve the invoice template id of not found get the default template id.
    const templateId =
      invoice.pdfTemplateId ??
      (
        await PdfTemplate.query().findOne({
          resource: 'SaleInvoice',
          default: true,
        })
      )?.id;
    //  Getting the branding template attributes.
    const brandingTemplate =
      await this.invoiceBrandingTemplateService.getInvoicePdfTemplate(
        tenantId,
        templateId
      );
    // Merge the branding template attributes with the invoice.
    return {
      ...brandingTemplate.attributes,
      ...transformInvoiceToPdfTemplate(invoice),
    };
  }
}
