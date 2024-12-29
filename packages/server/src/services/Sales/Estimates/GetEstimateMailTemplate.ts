import { Inject, Service } from 'typedi';
import {
  renderEstimateEmailTemplate,
  EstimatePaymentEmailProps,
} from '@bigcapital/email-components';
import { GetSaleEstimate } from './GetSaleEstimate';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetEstimateMailTemplateAttributesTransformer } from './GetEstimateMailTemplateAttributesTransformer';
import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';

@Service()
export class GetEstimateMailTemplate {
  @Inject()
  private getEstimateService: GetSaleEstimate;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private getBrandingTemplate: GetPdfTemplate;

  /**
   * Retrieves the mail template attributes of the given estimate.
   * Estimate template attributes are composed of the estimate and branding template attributes.
   * @param {number} tenantId
   * @param {number} estimateId - Estimate id.
   * @returns {Promise<EstimatePaymentEmailProps>}
   */
  public async getMailTemplateAttributes(
    tenantId: number,
    estimateId: number
  ): Promise<EstimatePaymentEmailProps> {
    const estimate = await this.getEstimateService.getEstimate(
      tenantId,
      estimateId
    );
    const brandingTemplate = await this.getBrandingTemplate.getPdfTemplate(
      tenantId,
      estimate.pdfTemplateId
    );
    const mailTemplateAttributes = await this.transformer.transform(
      tenantId,
      estimate,
      new GetEstimateMailTemplateAttributesTransformer(),
      {
        estimate,
        brandingTemplate,
      }
    );
    return mailTemplateAttributes;
  }

  /**
   * Rertieves the mail template html content.
   * @param {number} tenantId
   * @param {number} estimateId
   * @param overrideAttributes
   * @returns
   */
  public async getMailTemplate(
    tenantId: number,
    estimateId: number,
    overrideAttributes?: Partial<any>
  ): Promise<string> {
    const attributes = await this.getMailTemplateAttributes(
      tenantId,
      estimateId
    );
    const mergedAttributes = {
      ...attributes,
      ...overrideAttributes,
    };
    return renderEstimateEmailTemplate(mergedAttributes);
  }
}
