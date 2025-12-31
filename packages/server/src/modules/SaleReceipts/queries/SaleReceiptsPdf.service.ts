import { Inject, Injectable } from '@nestjs/common';
import { GetSaleReceipt } from './GetSaleReceipt.service';
import { SaleReceiptBrandingTemplate } from './SaleReceiptBrandingTemplate.service';
import { transformReceiptToBrandingTemplateAttributes } from '../utils';
import { SaleReceipt } from '../models/SaleReceipt';
import { ChromiumlyTenancy } from '@/modules/ChromiumlyTenancy/ChromiumlyTenancy.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { ISaleReceiptBrandingTemplateAttributes } from '../types/SaleReceipts.types';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { renderReceiptPaperTemplateHtml } from '@bigcapital/pdf-templates';

@Injectable()
export class SaleReceiptsPdfService {
  /**
   * @param {ChromiumlyTenancy} chromiumlyTenancy -
   * @param {TemplateInjectable} templateInjectable -
   * @param {GetSaleReceipt} getSaleReceiptService -
   * @param {SaleReceiptBrandingTemplate} saleReceiptBrandingTemplate -
   * @param {EventEmitter2} eventPublisher -
   * @param {typeof SaleReceipt} saleReceiptModel -
   * @param {typeof PdfTemplateModel} pdfTemplateModel -
   */
  constructor(
    private readonly chromiumlyTenancy: ChromiumlyTenancy,
    private readonly getSaleReceiptService: GetSaleReceipt,
    private readonly saleReceiptBrandingTemplate: SaleReceiptBrandingTemplate,
    private readonly eventPublisher: EventEmitter2,

    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: TenantModelProxy<typeof SaleReceipt>,

    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: TenantModelProxy<
      typeof PdfTemplateModel
    >,
  ) {}

  /**
   * Retrieves sale receipt html content.
   * @param {number} saleReceiptId
   */
  public async saleReceiptHtml(saleReceiptId: number) {
    const brandingAttributes =
      await this.getReceiptBrandingAttributes(saleReceiptId);
    return renderReceiptPaperTemplateHtml(brandingAttributes);
  }

  /**
   * Retrieves sale invoice pdf content.
   * @param {number} saleReceiptId - Sale receipt identifier.
   * @returns {Promise<Buffer>}
   */
  public async saleReceiptPdf(
    saleReceiptId: number,
  ): Promise<[Buffer, string]> {
    const filename = await this.getSaleReceiptFilename(saleReceiptId);
    const htmlContent = await this.saleReceiptHtml(saleReceiptId);

    // Renders the html content to pdf document.
    const content =
      await this.chromiumlyTenancy.convertHtmlContent(htmlContent);
    const eventPayload = { saleReceiptId };

    // Triggers the `onSaleReceiptPdfViewed` event.
    await this.eventPublisher.emitAsync(
      events.saleReceipt.onPdfViewed,
      eventPayload,
    );
    return [content, filename];
  }

  /**
   * Retrieves the filename file document of the given sale receipt.
   * @param {number} receiptId
   * @returns {Promise<string>}
   */
  public async getSaleReceiptFilename(receiptId: number): Promise<string> {
    const receipt = await this.saleReceiptModel().query().findById(receiptId);

    return `Receipt-${receipt.receiptNumber}`;
  }

  /**
   * Retrieves receipt branding attributes.
   * @param {number} receiptId - Sale receipt identifier.
   * @returns {Promise<ISaleReceiptBrandingTemplateAttributes>}
   */
  public async getReceiptBrandingAttributes(
    receiptId: number,
  ): Promise<ISaleReceiptBrandingTemplateAttributes> {
    const saleReceipt =
      await this.getSaleReceiptService.getSaleReceipt(receiptId);

    // Retrieve the invoice template id of not found get the default template id.
    const templateId =
      saleReceipt.pdfTemplateId ??
      (
        await this.pdfTemplateModel().query().findOne({
          resource: 'SaleReceipt',
          default: true,
        })
      )?.id;
    // Retrieves the receipt branding template.
    const brandingTemplate =
      await this.saleReceiptBrandingTemplate.getSaleReceiptBrandingTemplate(
        templateId,
      );
    const finalAttributes = {
      ...brandingTemplate.attributes,
      ...transformReceiptToBrandingTemplateAttributes(saleReceipt),
    };
    return finalAttributes;
  }
}
