import { Inject } from 'typedi';
import { CreateInvoiceCheckoutSession } from './CreateInvoiceCheckoutSession';
import { StripeInvoiceCheckoutSessionPOJO } from '@/interfaces/StripePayment';
import { CreateStripeAccountService } from './CreateStripeAccountService';
import { CreateStripeAccountDTO } from './types';

export class StripePaymentApplication {
  @Inject()
  private createStripeAccountService: CreateStripeAccountService;

  @Inject()
  private createSaleInvoiceCheckoutSessionService: CreateInvoiceCheckoutSession;

  /**
   * Creates a new Stripe account for Bigcapital.
   * @param {number} tenantId
   * @param {number} createStripeAccountDTO
   */
  public createStripeAccount(
    tenantId: number,
    createStripeAccountDTO: CreateStripeAccountDTO
  ) {
    return this.createStripeAccountService.createStripeAccount(
      tenantId,
      createStripeAccountDTO
    );
  }

  /**
   * Creates the Stripe checkout session from the given sale invoice.
   * @param {number} tenantId
   * @param {string} paymentLinkId
   * @returns {Promise<StripeInvoiceCheckoutSessionPOJO>}
   */
  public createSaleInvoiceCheckoutSession(
    tenantId: number,
    paymentLinkId: number
  ): Promise<StripeInvoiceCheckoutSessionPOJO> {
    return this.createSaleInvoiceCheckoutSessionService.createInvoiceCheckoutSession(
      tenantId,
      paymentLinkId
    );
  }
}
