import {
  ReceiptEmailTemplateProps,
  renderReceiptEmailTemplate,
} from '@bigcapital/email-components';
import { Injectable } from '@nestjs/common';
import { GetSaleReceipt } from './GetSaleReceipt.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetPdfTemplateService } from '@/modules/PdfTemplate/queries/GetPdfTemplate.service';
import { GetSaleReceiptMailTemplateAttributesTransformer } from './GetSaleReceiptMailTemplate.transformer';

@Injectable()
export class GetSaleReceiptMailTemplateService {
  constructor(
    private readonly getReceiptService: GetSaleReceipt,
    private readonly transformer: TransformerInjectable,
    private readonly getBrandingTemplate: GetPdfTemplateService,
  ) {}

  /**
   * Retrieves the mail template attributes of the given estimate.
   * Estimate template attributes are composed of the estimate and branding template attributes.
   * @param {number} receiptId - Receipt id.
   * @returns {Promise<EstimatePaymentEmailProps>}
   */
  public async getMailTemplateAttributes(
    receiptId: number,
  ): Promise<ReceiptEmailTemplateProps> {
    const receipt = await this.getReceiptService.getSaleReceipt(receiptId);
    const brandingTemplate = await this.getBrandingTemplate.getPdfTemplate(
      receipt.pdfTemplateId,
    );
    const mailTemplateAttributes = await this.transformer.transform(
      receipt,
      new GetSaleReceiptMailTemplateAttributesTransformer(),
      {
        receipt,
        brandingTemplate,
      },
    );
    return mailTemplateAttributes;
  }

  /**
   * Retrieves the mail template html content.
   * @param {number} receiptId
   * @param overrideAttributes
   * @returns
   */
  public async getMailTemplate(
    receiptId: number,
    overrideAttributes?: Partial<any>,
  ): Promise<string> {
    const attributes = await this.getMailTemplateAttributes(receiptId);
    const mergedAttributes = {
      ...attributes,
      ...overrideAttributes,
    };
    return renderReceiptEmailTemplate(mergedAttributes);
  }
}
