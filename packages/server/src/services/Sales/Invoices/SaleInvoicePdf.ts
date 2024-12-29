import { Inject, Service } from 'typedi';
import {
  renderInvoicePaperTemplateHtml,
  InvoicePaperTemplateProps,
} from '@bigcapital/pdf-templates';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { GetSaleInvoice } from './GetSaleInvoice';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { transformInvoiceToPdfTemplate } from './utils';
import { SaleInvoicePdfTemplate } from './SaleInvoicePdfTemplate';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class SaleInvoicePdf {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private getInvoiceService: GetSaleInvoice;

  @Inject()
  private invoiceBrandingTemplateService: SaleInvoicePdfTemplate;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Retrieve sale invoice html content.
   * @param {number} tenantId - Tenant Id.
   * @param {ISaleInvoice} saleInvoice -
   * @returns {Promise<string>}
   */
  public async saleInvoiceHtml(
    tenantId: number,
    invoiceId: number
  ): Promise<string> {
    const brandingAttributes = await this.getInvoiceBrandingAttributes(
      tenantId,
      invoiceId
    );
    return renderInvoicePaperTemplateHtml({
      ...brandingAttributes,
    });
  }

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId - Tenant Id.
   * @param {ISaleInvoice} saleInvoice -
   * @returns {Promise<[Buffer, string]>}
   */
  public async saleInvoicePdf(
    tenantId: number,
    invoiceId: number
  ): Promise<[Buffer, string]> {
    const filename = await this.getInvoicePdfFilename(tenantId, invoiceId);

    const htmlContent = await this.saleInvoiceHtml(tenantId, invoiceId);

    // Converts the given html content to pdf document.
    const buffer = await this.chromiumlyTenancy.convertHtmlContent(
      tenantId,
      htmlContent
    );
    const eventPayload = { tenantId, saleInvoiceId: invoiceId };

    // Triggers the `onSaleInvoicePdfViewed` event.
    await this.eventPublisher.emitAsync(
      events.saleInvoice.onPdfViewed,
      eventPayload
    );
    return [buffer, filename];
  }

  /**
   * Retrieves the filename pdf document of the given invoice.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns {Promise<string>}
   */
  private async getInvoicePdfFilename(
    tenantId: number,
    invoiceId: number
  ): Promise<string> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoice = await SaleInvoice.query().findById(invoiceId);

    return `Invoice-${invoice.invoiceNo}`;
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
  ): Promise<InvoicePaperTemplateProps> {
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
