import { Inject, Service } from 'typedi';
import { ISaleInvoice } from '@/interfaces';
import { StripePaymentService } from './StripePaymentService';
import HasTenancyService from '../Tenancy/TenancyService';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { StripePaymentLinkCreatedEventPayload } from '@/interfaces/StripePayment';
import { STRIPE_PAYMENT_LINK_REDIRECT } from './constants';
import events from '@/subscribers/events';

@Service()
export class SaleInvoiceStripePaymentLink {
  @Inject()
  private stripePayment: StripePaymentService;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Creates a Stripe payment link for the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} stripeIntegrationId - Stripe integration id.
   * @param {ISaleInvoice} saleInvoice - Sale invoice id.
   * @returns {Promise<string>}
   */
  async createPaymentLink(
    tenantId: number,
    stripeIntegrationId: number,
    invoiceId: number
  ) {
    const { SaleInvoice, PaymentIntegration } = this.tenancy.models(tenantId);

    const stripeIntegration = await PaymentIntegration.query()
      .findById(stripeIntegrationId)
      .throwIfNotFound();
    const stripeAccountId = stripeIntegration.accountId;

    const invoice = await SaleInvoice.query()
      .findById(invoiceId)
      .throwIfNotFound();

    // Creates Stripe price.
    const price = await this.createStripePrice(invoice, stripeAccountId);

    // Creates Stripe payment link.
    const paymentLink = await this.createStripePaymentLink(
      price.id,
      invoice,
      stripeAccountId,
      { tenantId }
    );
    // Associate the payment link id to the invoice.
    await this.updateInvoiceWithPaymentLink(
      tenantId,
      invoiceId,
      paymentLink.id
    );
    // Triggers `onStripePaymentLinkCreated` event.
    await this.eventPublisher.emitAsync(
      events.stripeIntegration.onPaymentLinkCreated,
      {
        tenantId,
        stripeIntegrationId,
        saleInvoiceId: invoiceId,
        paymentLinkId: paymentLink.id,
      } as StripePaymentLinkCreatedEventPayload
    );
    return paymentLink.id;
  }

  /**
   * Creates a Stripe price for the invoice.
   * @param {ISaleInvoice} invoice - Sale invoice.
   * @param {string} stripeAccountId - Stripe account id.
   * @returns {Promise<Stripe.Price>}
   */
  private async createStripePrice(
    invoice: ISaleInvoice,
    stripeAccountId: string
  ) {
    return this.stripePayment.stripe.prices.create(
      {
        unit_amount: invoice.total * 100,
        currency: 'usd',
        product_data: {
          name: invoice.invoiceNo,
        },
      },
      { stripeAccount: stripeAccountId }
    );
  }

  /**
   * Creates a Stripe payment link.
   * @param {string} priceId - Stripe price id.
   * @param {ISaleInvoice} invoice - Sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {string} stripeAccountId - Stripe account id.
   * @returns {Promise<Stripe.PaymentLink>}
   */
  private async createStripePaymentLink(
    priceId: string,
    invoice: ISaleInvoice,
    stripeAccountId: string,
    metadata: Record<string, any> = {}
  ) {
    const paymentLinkInfo = {
      line_items: [{ price: priceId, quantity: 1 }],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: STRIPE_PAYMENT_LINK_REDIRECT,
        },
      },
      metadata: {
        saleInvoiceId: invoice.id,
        resource: 'SaleInvoice',
        ...metadata,
      },
    };
    return this.stripePayment.stripe.paymentLinks.create(paymentLinkInfo, {
      stripeAccount: stripeAccountId,
    });
  }

  /**
   * Updates the sale invoice with the Stripe payment link id.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Sale invoice id.
   * @param {string} paymentLinkId - Stripe payment link id.
   */
  private async updateInvoiceWithPaymentLink(
    tenantId: number,
    invoiceId: number,
    paymentLinkId: string
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    await SaleInvoice.query().findById(invoiceId).patch({
      stripePlinkId: paymentLinkId,
    });
  }
}
