import {
  ReceiptEmailTemplateProps,
  renderReceiptEmailTemplate,
} from '@bigcapital/email-components';
import { Inject, Service } from 'typedi';
import { GetSaleReceipt } from './GetSaleReceipt';
import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetSaleReceiptMailTemplateAttributesTransformer } from './GetSaleReceiptMailTemplateAttributesTransformer';

@Service()
export class GetSaleReceiptMailTemplate {
  @Inject()
  private getReceiptService: GetSaleReceipt;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private getBrandingTemplate: GetPdfTemplate;

  /**
   * Retrieves the mail template attributes of the given estimate.
   * Estimate template attributes are composed of the estimate and branding template attributes.
   * @param {number} tenantId
   * @param {number} receiptId - Receipt id.
   * @returns {Promise<EstimatePaymentEmailProps>}
   */
  public async getMailTemplateAttributes(
    tenantId: number,
    receiptId: number
  ): Promise<ReceiptEmailTemplateProps> {
    const receipt = await this.getReceiptService.getSaleReceipt(
      tenantId,
      receiptId
    );
    const brandingTemplate = await this.getBrandingTemplate.getPdfTemplate(
      tenantId,
      receipt.pdfTemplateId
    );
    const mailTemplateAttributes = await this.transformer.transform(
      tenantId,
      receipt,
      new GetSaleReceiptMailTemplateAttributesTransformer(),
      {
        receipt,
        brandingTemplate,
      }
    );
    return mailTemplateAttributes;
  }

  /**
   * Retrieves the mail template html content.
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
    return renderReceiptEmailTemplate(mergedAttributes);
  }
}
