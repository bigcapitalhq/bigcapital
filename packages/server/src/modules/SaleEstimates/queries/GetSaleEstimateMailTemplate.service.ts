import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import {
  renderEstimateEmailTemplate,
  EstimatePaymentEmailProps,
} from '@bigcapital/email-components';
import { Injectable } from '@nestjs/common';
import { GetSaleEstimate } from './GetSaleEstimate.service';
import { GetPdfTemplateService } from '@/modules/PdfTemplate/queries/GetPdfTemplate.service';
import { GetEstimateMailTemplateAttributesTransformer } from './GetEstimateMailTemplateAttributes.transformer';

@Injectable()
export class GetSaleEstimateMailTemplateService {
  constructor(
    private readonly getEstimateService: GetSaleEstimate,
    private readonly transformer: TransformerInjectable,
    private readonly getBrandingTemplate: GetPdfTemplateService,
  ) {}

  /**
   * Retrieves the mail template attributes of the given estimate.
   * Estimate template attributes are composed of the estimate and branding template attributes.
   * @param {number} estimateId - Estimate id.
   * @returns {Promise<EstimatePaymentEmailProps>}
   */
  public async getMailTemplateAttributes(
    estimateId: number,
  ): Promise<EstimatePaymentEmailProps> {
    const estimate = await this.getEstimateService.getEstimate(estimateId);
    const brandingTemplate = await this.getBrandingTemplate.getPdfTemplate(
      estimate.pdfTemplateId,
    );
    const mailTemplateAttributes = await this.transformer.transform(
      estimate,
      new GetEstimateMailTemplateAttributesTransformer(),
      {
        estimate,
        brandingTemplate,
      },
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
    estimateId: number,
    overrideAttributes?: Partial<any>,
  ): Promise<string> {
    const attributes = await this.getMailTemplateAttributes(estimateId);
    const mergedAttributes = {
      ...attributes,
      ...overrideAttributes,
    };
    return renderEstimateEmailTemplate(mergedAttributes);
  }
}
