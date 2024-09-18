import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  PaymentIntegrationTransactionLinkDeleteEventPayload,
  PaymentIntegrationTransactionLinkEventPayload,
} from '@/interfaces';
import { SaleInvoiceStripePaymentLink } from '../SaleInvoiceStripePaymentLink';
import { runAfterTransaction } from '@/services/UnitOfWork/TransactionsHooks';
import events from '@/subscribers/events';
import { DeleteStripePaymentLinkInvoice } from '../DeleteStripePaymentLinkInvoice';

@Service()
export class CreatePaymentLinkOnInvoiceCreated extends EventSubscriber {
  @Inject()
  private invoiceStripePaymentLink: SaleInvoiceStripePaymentLink;

  @Inject()
  private deleteStripePaymentLinkInvoice: DeleteStripePaymentLinkInvoice;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.paymentIntegrationLink.onPaymentIntegrationLink,
      this.handleCreatePaymentLinkOnIntegrationLink
    );
    bus.subscribe(
      events.paymentIntegrationLink.onPaymentIntegrationDeleteLink,
      this.handleDeletePaymentLinkOnIntegrationLinkDelete
    );
  }

  /**
   * Updates the Plaid item transactions
   * @param {IPlaidItemCreatedEventPayload} payload - Event payload.
   */
  private handleCreatePaymentLinkOnIntegrationLink = async ({
    tenantId,
    paymentIntegrationId,
    referenceId,
    referenceType,
    trx,
  }: PaymentIntegrationTransactionLinkEventPayload) => {
    // Can't continue if the link request is not coming from the invoice transaction.
    if ('SaleInvoice' !== referenceType) {
      return;
    }
    runAfterTransaction(trx, async () => {
      await this.invoiceStripePaymentLink.createPaymentLink(
        tenantId,
        paymentIntegrationId,
        referenceId
      );
    });
  };

  /**
   * Deletes the Stripe payment link once the associated invoice deleted.
   * @param {ISaleInvoiceDeletedPayload}
   */
  private handleDeletePaymentLinkOnIntegrationLinkDelete = async ({
    oldSaleInvoiceId,
    tenantId,
    trx,
  }: PaymentIntegrationTransactionLinkDeleteEventPayload) => {
    await this.deleteStripePaymentLinkInvoice.deleteInvoicePaymentLink(
      tenantId,
      oldSaleInvoiceId,
      trx
    );
  };
}
