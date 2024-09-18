import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { StripePaymentService } from './StripePaymentService';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class DeleteStripePaymentLinkInvoice {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private stripePayment: StripePaymentService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Deletes the Stripe payment link associates to the given sale invoice.
   * @param {number} tenantId -
   * @param {number} invoiceId -
   * @param {Knex.Transaction} knex -
   */
  async deleteInvoicePaymentLink(
    tenantId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoice = await SaleInvoice.query(trx)
      .findById(invoiceId)
      .withGraphFetched('paymentMethods.paymentIntegration')
      .throwIfNotFound();

    // It will be only one Stripe payment method associated to the invoice.
    const stripePaymentMethod = invoice.paymentMethods?.find(
      (method) => method.paymentIntegration?.service === 'Stripe'
    );
    const stripeAccountId = stripePaymentMethod?.paymentIntegration?.accountId;
    const paymentIntegrationId = stripePaymentMethod?.paymentIntegration?.id;

    if (invoice.stripePlinkId && stripeAccountId) {
      const stripeAcocunt = { stripeAccount: stripeAccountId };
      const stripePlinkId = invoice.stripePlinkId;

      await this.stripePayment.stripe.paymentLinks.update(
        stripePlinkId,
        { active: false },
        stripeAcocunt
      );
      // Triggers `onStripePaymentLinkInactivated` event.
      await this.eventPublisher.emitAsync(
        events.stripeIntegration.onPaymentLinkInactivated,
        {
          tenantId,
          saleInvoiceId: invoiceId,
          paymentIntegrationId,
          stripePlinkId,
        }
      );
    }
  }
}
