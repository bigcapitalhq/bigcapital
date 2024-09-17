import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { GetSaleEstimate } from './GetSaleEstimate';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SaleEstimatePdfTemplate } from '../Invoices/SaleEstimatePdfTemplate';
import { transformEstimateToPdfTemplate } from './utils';
import { EstimatePdfBrandingAttributes } from './constants';

@Service()
export class SaleEstimatesPdf {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private getSaleEstimate: GetSaleEstimate;

  @Inject()
  private estimatePdfTemplate: SaleEstimatePdfTemplate;

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId -
   * @param {ISaleInvoice} saleInvoice -
   */
  public async getSaleEstimatePdf(tenantId: number, saleEstimateId: number) {
    const brandingAttributes = await this.getEstimateBrandingAttributes(
      tenantId,
      saleEstimateId
    );
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/estimate-regular',
      brandingAttributes
    );
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent);
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
  ): Promise<EstimatePdfBrandingAttributes> {
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
