import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import {
  renderReceiptPaperTemplateHtml,
  ReceiptPaperTemplateProps,
} from '@bigcapital/pdf-templates';
import { GetSaleReceipt } from './GetSaleReceipt';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SaleReceiptBrandingTemplate } from './SaleReceiptBrandingTemplate';
import { transformReceiptToBrandingTemplateAttributes } from './utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class SaleReceiptsPdf {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private getSaleReceiptService: GetSaleReceipt;

  @Inject()
  private saleReceiptBrandingTemplate: SaleReceiptBrandingTemplate;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Retrieves sale receipt html content.
   * @param {number} tennatId
   * @param {number} saleReceiptId
   */
  public async saleReceiptHtml(tennatId: number, saleReceiptId: number) {
    const brandingAttributes = await this.getReceiptBrandingAttributes(
      tennatId,
      saleReceiptId
    );
    return renderReceiptPaperTemplateHtml(brandingAttributes);
  }

  /**
   * Retrieves sale invoice pdf content.
   * @param {number} tenantId -
   * @param {number} saleInvoiceId -
   * @returns {Promise<Buffer>}
   */
  public async saleReceiptPdf(
    tenantId: number,
    saleReceiptId: number
  ): Promise<[Buffer, string]> {
    const filename = await this.getSaleReceiptFilename(tenantId, saleReceiptId);

    // Converts the receipt template to html content.
    const htmlContent = await this.saleReceiptHtml(tenantId, saleReceiptId);

    // Renders the html content to pdf document.
    const content = await this.chromiumlyTenancy.convertHtmlContent(
      tenantId,
      htmlContent
    );
    const eventPayload = { tenantId, saleReceiptId };

    // Triggers the `onSaleReceiptPdfViewed` event.
    await this.eventPublisher.emitAsync(
      events.saleReceipt.onPdfViewed,
      eventPayload
    );
    return [content, filename];
  }

  /**
   * Retrieves the filename file document of the given sale receipt.
   * @param {number} tenantId
   * @param {number} receiptId
   * @returns {Promise<string>}
   */
  public async getSaleReceiptFilename(
    tenantId: number,
    receiptId: number
  ): Promise<string> {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const receipt = await SaleReceipt.query().findById(receiptId);

    return `Receipt-${receipt.receiptNumber}`;
  }

  /**
   * Retrieves receipt branding attributes.
   * @param {number} tenantId
   * @param {number} receiptId
   * @returns {Promise<ReceiptPaperTemplateProps>}
   */
  public async getReceiptBrandingAttributes(
    tenantId: number,
    receiptId: number
  ): Promise<ReceiptPaperTemplateProps> {
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
