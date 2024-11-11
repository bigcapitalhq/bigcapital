import { Inject, Service } from 'typedi';
import { GetInvoicePaymentLinkMetadata } from './GetInvoicePaymentLinkMetadata';
import { CreateInvoiceCheckoutSession } from './CreateInvoiceCheckoutSession';
import { StripeInvoiceCheckoutSessionPOJO } from '@/interfaces/StripePayment';
import { GetPaymentLinkInvoicePdf } from './GetPaymentLinkInvoicePdf';

@Service()
export class PaymentLinksApplication {
  @Inject()
  private getInvoicePaymentLinkMetadataService: GetInvoicePaymentLinkMetadata;

  @Inject()
  private createInvoiceCheckoutSessionService: CreateInvoiceCheckoutSession;

  @Inject()
  private getPaymentLinkInvoicePdfService: GetPaymentLinkInvoicePdf;

  /**
   * Retrieves the invoice payment link.
   * @param {string} paymentLinkId
   * @returns {}
   */
  public getInvoicePaymentLink(paymentLinkId: string) {
    return this.getInvoicePaymentLinkMetadataService.getInvoicePaymentLinkMeta(
      paymentLinkId
    );
  }

  /**
   * Create the invoice payment checkout session from the given payment link id.
   * @param {string} paymentLinkId - Payment link id.
   * @returns {Promise<StripeInvoiceCheckoutSessionPOJO>}
   */
  public createInvoicePaymentCheckoutSession(
    paymentLinkId: string
  ): Promise<StripeInvoiceCheckoutSessionPOJO> {
    return this.createInvoiceCheckoutSessionService.createInvoiceCheckoutSession(
      paymentLinkId
    );
  }

  /**
   * Retrieves the sale invoice pdf of the given payment link id.
   * @param {number} tenantId
   * @param {number} paymentLinkId
   * @returns {Promise<Buffer> }
   */
  public getPaymentLinkInvoicePdf(
    paymentLinkId: string
  ): Promise<[Buffer, string]> {
    return this.getPaymentLinkInvoicePdfService.getPaymentLinkInvoicePdf(
      paymentLinkId
    );
  }
}
