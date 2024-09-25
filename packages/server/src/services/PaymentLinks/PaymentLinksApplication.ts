import { Inject, Service } from 'typedi';
import { GetInvoicePaymentLinkMetadata } from './GetInvoicePaymentLinkMetadata';
import { CreateInvoiceCheckoutSession } from './CreateInvoiceCheckoutSession';
import { StripeInvoiceCheckoutSessionPOJO } from '@/interfaces/StripePayment';

@Service()
export class PaymentLinksApplication {
  @Inject()
  private getInvoicePaymentLinkMetadataService: GetInvoicePaymentLinkMetadata;

  @Inject()
  private createInvoiceCheckoutSessionService: CreateInvoiceCheckoutSession;

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
}
