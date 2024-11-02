import { Inject, Service } from 'typedi';
import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { GetSaleInvoice } from './GetSaleInvoice';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import {
  InvoicePaymentEmailProps,
  renderInvoicePaymentEmail,
} from '@bigcapital/email-components';
import { GetInvoiceMailTemplateAttributesTransformer } from './GetInvoicePaymentMailAttributesTransformer';

@Service()
export class GetInvoicePaymentMail {
  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;

  @Inject()
  private getBrandingTemplate: GetPdfTemplate;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the mail template attributes of the given invoice.
   * Invoice template attributes are composed of the invoice and branding template attributes.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Invoice id.
   */
  public async getMailTemplateAttributes(tenantId: number, invoiceId: number) {
    const invoice = await this.getSaleInvoiceService.getSaleInvoice(
      tenantId,
      invoiceId
    );
    const brandingTemplate = await this.getBrandingTemplate.getPdfTemplate(
      tenantId,
      invoice.pdfTemplateId
    );
    const mailTemplateAttributes = await this.transformer.transform(
      tenantId,
      invoice,
      new GetInvoiceMailTemplateAttributesTransformer(),
      {
        invoice,
        brandingTemplate,
      }
    );
    return mailTemplateAttributes;
  }

  /**
   * Retrieves the mail template html content.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Invoice id.
   */
  public async getMailTemplate(
    tenantId: number,
    invoiceId: number,
    overrideAttributes?: Partial<InvoicePaymentEmailProps>
  ): Promise<string> {
    const attributes = await this.getMailTemplateAttributes(
      tenantId,
      invoiceId
    );
    const mergedAttributes = { ...attributes, ...overrideAttributes };

    return renderInvoicePaymentEmail(mergedAttributes);
  }
}
