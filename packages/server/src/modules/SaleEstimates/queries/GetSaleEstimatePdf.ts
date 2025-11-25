import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetSaleEstimate } from './GetSaleEstimate.service';
import { transformEstimateToPdfTemplate } from '../utils';
import { EstimatePdfBrandingAttributes } from '../constants';
import { SaleEstimatePdfTemplate } from '@/modules/SaleInvoices/queries/SaleEstimatePdfTemplate.service';
import { ChromiumlyTenancy } from '@/modules/ChromiumlyTenancy/ChromiumlyTenancy.service';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { events } from '@/common/events/events';
import { SaleEstimate } from '../models/SaleEstimate';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { renderEstimatePaperTemplateHtml } from '@bigcapital/pdf-templates';

@Injectable()
export class GetSaleEstimatePdf {
  constructor(
    private readonly chromiumlyTenancy: ChromiumlyTenancy,
    private readonly getSaleEstimate: GetSaleEstimate,
    private readonly estimatePdfTemplate: SaleEstimatePdfTemplate,
    private readonly eventPublisher: EventEmitter2,

    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: TenantModelProxy<
      typeof PdfTemplateModel
    >,

    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,
  ) { }

  /**
   * Retrieve sale estimate html content.
   * @param {number} invoiceId -
   */
  public async saleEstimateHtml(estimateId: number): Promise<string> {
    const brandingAttributes =
      await this.getEstimateBrandingAttributes(estimateId);

    return renderEstimatePaperTemplateHtml({ ...brandingAttributes });
  }

  /**
   * Retrieve sale invoice pdf content.
   * @param {ISaleInvoice} saleInvoice - Sale estimate id.
   */
  public async getSaleEstimatePdf(
    saleEstimateId: number,
  ): Promise<[Buffer, string]> {
    const filename = await this.getSaleEstimateFilename(saleEstimateId);

    // Retrieves the sale estimate html.
    const htmlContent = await this.saleEstimateHtml(saleEstimateId);
    const buffer =
      await this.chromiumlyTenancy.convertHtmlContent(htmlContent);

    const eventPayload = { saleEstimateId };

    // Triggers the `onSaleEstimatePdfViewed` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onPdfViewed,
      eventPayload,
    );
    return [buffer, filename];
  }

  /**
   * Retrieves the filename file document of the given estimate.
   * @param {number} estimateId - Estimate id.
   * @returns {Promise<string>}
   */
  private async getSaleEstimateFilename(estimateId: number) {
    const estimate = await this.saleEstimateModel()
      .query()
      .findById(estimateId);

    return `Estimate-${estimate.estimateNumber}`;
  }

  /**
   * Retrieves the given estimate branding attributes.
   * @param {number} estimateId - Estimate id.
   * @returns {Promise<EstimatePdfBrandingAttributes>}
   */
  async getEstimateBrandingAttributes(
    estimateId: number,
  ): Promise<EstimatePdfBrandingAttributes> {
    const saleEstimate = await this.getSaleEstimate.getEstimate(estimateId);
    // Retrieve the invoice template id of not found get the default template id.
    const templateId =
      saleEstimate.pdfTemplateId ??
      (
        await this.pdfTemplateModel().query().findOne({
          resource: 'SaleEstimate',
          default: true,
        })
      )?.id;
    const brandingTemplate =
      await this.estimatePdfTemplate.getEstimatePdfTemplate(templateId);
    return {
      ...brandingTemplate.attributes,
      ...transformEstimateToPdfTemplate(saleEstimate),
    };
  }
}
