import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { StripePaymentService } from './StripePaymentService';
import { Knex } from 'knex';

@Service()
export class DeleteStripePaymentLinkInvoice {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private stripePayment: StripePaymentService;

  /**
   * Deletes the Stripe payment link associates to the given sale invoice.
   * @param {number} tenantId
   * @param {number} invoiceId
   */
  async deletePaymentLink(
    tenantId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const invoice = await SaleInvoice.query().findById(invoiceId);

    const stripeAcocunt = { stripeAccount: 'acct_1Px3dSPjeOqFxnPw' };

    if (invoice.stripePlinkId) {
      await this.stripePayment.stripe.paymentLinks.update(
        invoice.stripePlinkId,
        { active: false },
        stripeAcocunt
      );
    }
  }
}
