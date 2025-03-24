import { Injectable } from '@nestjs/common';
import { GetInvoicePaymentLinkMetadata } from './GetInvoicePaymentLinkMetadata';
import { CreateInvoiceCheckoutSession } from './CreateInvoiceCheckoutSession';
import { GetPaymentLinkInvoicePdf } from './GetPaymentLinkInvoicePdf';
import { StripeInvoiceCheckoutSessionPOJO } from '../StripePayment/StripePayment.types';

@Injectable()
export class PaymentLinksApplication {
  constructor(
    private readonly getInvoicePaymentLinkMetadataService: GetInvoicePaymentLinkMetadata,
    private readonly createInvoiceCheckoutSessionService: CreateInvoiceCheckoutSession,
    private readonly getPaymentLinkInvoicePdfService: GetPaymentLinkInvoicePdf,
  ) {}

  /**
   * Retrieves the invoice payment link.
   * @param {string} paymentLinkId
   * @returns {}
   */
  public getInvoicePaymentLink(paymentLinkId: string) {
    return this.getInvoicePaymentLinkMetadataService.getInvoicePaymentLinkMeta(
      paymentLinkId,
    );
  }

  /**
   * Create the invoice payment checkout session from the given payment link id.
   * @param {string} paymentLinkId - Payment link id.
   * @returns {Promise<StripeInvoiceCheckoutSessionPOJO>}
   */
  public createInvoicePaymentCheckoutSession(
    paymentLinkId: string,
  ): Promise<StripeInvoiceCheckoutSessionPOJO> {
    return this.createInvoiceCheckoutSessionService.createInvoiceCheckoutSession(
      paymentLinkId,
    );
  }

  /**
   * Retrieves the sale invoice pdf of the given payment link id.
   * @param {number} paymentLinkId
   * @returns {Promise<Buffer> }
   */
  public getPaymentLinkInvoicePdf(
    paymentLinkId: string,
  ): Promise<[Buffer, string]> {
    return this.getPaymentLinkInvoicePdfService.getPaymentLinkInvoicePdf(
      paymentLinkId,
    );
  }
}
