import { ISaleInvoice } from '@/interfaces';
import { StripePaymentService } from './StripePaymentService';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { STRIPE_PAYMENT_LINK_REDIRECT } from './constants';

@Service()
export class SaleInvoiceStripePaymentLink {
  @Inject()
  private stripePayment: StripePaymentService;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Creates a Stripe payment link for the given sale invoice.
   * @param {number} tenantId
   * @param {ISaleInvoice} saleInvoice
   * @returns {Promise<string>}
   */
  async createPaymentLink(tenantId: number, saleInvoice: ISaleInvoice) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const saleInvoiceId = saleInvoice.id;

    try {
      const stripeAcocunt = { stripeAccount: 'acct_1Px3dSPjeOqFxnPw' };
      const price = await this.stripePayment.stripe.prices.create(
        {
          unit_amount: saleInvoice.total * 100,
          currency: 'usd',
          product_data: {
            name: saleInvoice.invoiceNo,
          },
        },
        stripeAcocunt
      );
      const paymentLinkInfo = {
        line_items: [{ price: price.id, quantity: 1 }],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: STRIPE_PAYMENT_LINK_REDIRECT,
          },
        },
        metadata: { saleInvoiceId, tenantId, resource: 'SaleInvoice' },
      };
      const paymentLink = await this.stripePayment.stripe.paymentLinks.create(
        paymentLinkInfo,
        stripeAcocunt
      );
      await SaleInvoice.query().findById(saleInvoiceId).patch({
        stripePlinkId: paymentLink.id,
      });
      return paymentLink.id;
    } catch (error) {
      console.error('Error creating payment link:', error);
    }
  }
}
