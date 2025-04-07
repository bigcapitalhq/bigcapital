import {
  InvoicePaymentEmailProps,
  renderInvoicePaymentEmail,
} from '@bigcapital/email-components';
import { GetSaleInvoice } from './GetSaleInvoice.service';
import { GetPdfTemplateService } from '@/modules/PdfTemplate/queries/GetPdfTemplate.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetInvoicePaymentMailAttributesTransformer } from './GetInvoicePaymentMailAttributes.transformer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetInvoicePaymentMail {
  constructor(
    private readonly getSaleInvoiceService: GetSaleInvoice,
    private readonly getBrandingTemplate: GetPdfTemplateService,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieves the mail template attributes of the given invoice.
   * Invoice template attributes are composed of the invoice and branding template attributes.
   * @param {number} invoiceId - Invoice id.
   */
  public async getMailTemplateAttributes(invoiceId: number) {
    const invoice = await this.getSaleInvoiceService.getSaleInvoice(invoiceId);
    const brandingTemplate = await this.getBrandingTemplate.getPdfTemplate(
      invoice.pdfTemplateId,
    );
    const mailTemplateAttributes = await this.transformer.transform(
      invoice,
      new GetInvoicePaymentMailAttributesTransformer(),
      {
        invoice,
        brandingTemplate,
      },
    );
    return mailTemplateAttributes;
  }

  /**
   * Retrieves the mail template html content.
   * @param {number} invoiceId - Invoice id.
   */
  public async getMailTemplate(
    invoiceId: number,
    overrideAttributes?: Partial<InvoicePaymentEmailProps>,
  ): Promise<string> {
    const attributes = await this.getMailTemplateAttributes(invoiceId);
    const mergedAttributes = { ...attributes, ...overrideAttributes };

    return renderInvoicePaymentEmail(mergedAttributes);
  }
}
