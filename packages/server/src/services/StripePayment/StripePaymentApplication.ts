import { Inject } from 'typedi';
import { CreateInvoiceCheckoutSession } from './CreateInvoiceCheckoutSession';
import { StripeInvoiceCheckoutSessionPOJO } from '@/interfaces/StripePayment';
import { CreateStripeAccountService } from './CreateStripeAccountService';
import { CreateStripeAccountLinkService } from './CreateStripeAccountLink';
import { CreateStripeAccountDTO } from './types';

export class StripePaymentApplication {
  @Inject()
  private createStripeAccountService: CreateStripeAccountService;

  @Inject()
  private createStripeAccountLinkService: CreateStripeAccountLinkService;

  @Inject()
  private createInvoiceCheckoutSessionService: CreateInvoiceCheckoutSession;

  /**
   * Creates a new Stripe account for Bigcapital.
   * @param {number} tenantId
   * @param {number} createStripeAccountDTO
   */
  public createStripeAccount(
    tenantId: number,
    createStripeAccountDTO: CreateStripeAccountDTO = {}
  ) {
    return this.createStripeAccountService.createStripeAccount(
      tenantId,
      createStripeAccountDTO
    );
  }

  /**
   * Creates a new Stripe account link of the given Stripe accoun..
   * @param {number} tenantId
   * @param {string} stripeAccountId
   * @returns {}
   */
  public createAccountLink(tenantId: number, stripeAccountId: string) {
    return this.createStripeAccountLinkService.createAccountLink(
      tenantId,
      stripeAccountId
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
    return this.createInvoiceCheckoutSessionService.createInvoiceCheckoutSession(
      tenantId,
      paymentLinkId
    );
  }
}
