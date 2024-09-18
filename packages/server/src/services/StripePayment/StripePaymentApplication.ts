import { Knex } from 'knex';
import { Inject } from 'typedi';
import { CreateStripeAccountService } from '@/api/controllers/StripeIntegration/CreateStripeAccountService';
import { CreateStripeAccountDTO } from '@/api/controllers/StripeIntegration/types';
import { SaleInvoiceStripePaymentLink } from './SaleInvoiceStripePaymentLink';
import { DeleteStripePaymentLinkInvoice } from './DeleteStripePaymentLinkInvoice';

export class StripePaymentApplication {
  @Inject()
  private createStripeAccountService: CreateStripeAccountService;

  @Inject()
  private saleInvoiceStripePaymentLinkService: SaleInvoiceStripePaymentLink;

  @Inject()
  private deleteStripePaymentLinkInvoice: DeleteStripePaymentLinkInvoice;

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
   * Creates a Stripe payment link for the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} stripeIntegrationId - Stripe integration id.
   * @param {ISaleInvoice} saleInvoice - Sale invoice id.
   * @returns {Promise<string>}
   */
  public createSaleInvoicePaymentLink(
    tenantId: number,
    stripeIntegrationId: number,
    invoiceId: number
  ) {
    return this.saleInvoiceStripePaymentLinkService.createPaymentLink(
      tenantId,
      stripeIntegrationId,
      invoiceId
    );
  }

  /**
   * Deletes the Stripe payment link associated with the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Sale invoice id.
   * @returns {Promise<void>}
   */
  public deleteInvoicePaymentLink(
    tenantId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    return this.deleteStripePaymentLinkInvoice.deleteInvoicePaymentLink(
      tenantId,
      invoiceId,
      trx
    );
  }
}
