import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { GetSaleEstimate } from './GetSaleEstimate';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SaleEstimatePdfTemplate } from '../Invoices/SaleEstimatePdfTemplate';
import { transformEstimateToPdfTemplate } from './utils';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { renderEstimatePaperTemplateHtml, EstimatePaperTemplateProps } from '@bigcapital/pdf-templates';

@Service()
export class SaleEstimatesPdf {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private getSaleEstimate: GetSaleEstimate;

  @Inject()
  private estimatePdfTemplate: SaleEstimatePdfTemplate;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Retrieve sale estimate html content.
   * @param {number} tenantId -
   * @param {number} invoiceId -
   */
  public async saleEstimateHtml(
    tenantId: number,
    estimateId: number
  ): Promise<string> {
    const brandingAttributes = await this.getEstimateBrandingAttributes(
      tenantId,
      estimateId
    );
    return renderEstimatePaperTemplateHtml({ ...brandingAttributes });
  }

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId -
   * @param {ISaleInvoice} saleInvoice -
   */
  public async getSaleEstimatePdf(
    tenantId: number,
    saleEstimateId: number
  ): Promise<[Buffer, string]> {
    const filename = await this.getSaleEstimateFilename(
      tenantId,
      saleEstimateId
    );
    // Retireves the sale estimate html.
    const htmlContent = await this.saleEstimateHtml(tenantId, saleEstimateId);

    // Converts the html content to pdf.
    const content = await this.chromiumlyTenancy.convertHtmlContent(
      tenantId,
      htmlContent
    );
    const eventPayload = { tenantId, saleEstimateId };

    // Triggers the `onSaleEstimatePdfViewed` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onPdfViewed,
      eventPayload
    );
    return [content, filename];
  }

  /**
   * Retrieves the filename file document of the given estimate.
   * @param {number} tenantId
   * @param {number} estimateId
   * @returns {Promise<string>}
   */
  private async getSaleEstimateFilename(tenantId: number, estimateId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const estimate = await SaleEstimate.query().findById(estimateId);

    return `Estimate-${estimate.estimateNumber}`;
  }

  /**
   * Retrieves the given estimate branding attributes.
   * @param {number} tenantId - Tenant id.
   * @param {number} estimateId - Estimate id.
   * @returns {Promise<EstimatePdfBrandingAttributes>}
   */
  async getEstimateBrandingAttributes(
    tenantId: number,
    estimateId: number
  ): Promise<EstimatePaperTemplateProps> {
    const { PdfTemplate } = this.tenancy.models(tenantId);
    const saleEstimate = await this.getSaleEstimate.getEstimate(
      tenantId,
      estimateId
    );
    // Retrieve the invoice template id of not found get the default template id.
    const templateId =
      saleEstimate.pdfTemplateId ??
      (
        await PdfTemplate.query().findOne({
          resource: 'SaleEstimate',
          default: true,
        })
      )?.id;
    const brandingTemplate =
      await this.estimatePdfTemplate.getEstimatePdfTemplate(
        tenantId,
        templateId
      );
    return {
      ...brandingTemplate.attributes,
      ...transformEstimateToPdfTemplate(saleEstimate),
    };
  }
}
