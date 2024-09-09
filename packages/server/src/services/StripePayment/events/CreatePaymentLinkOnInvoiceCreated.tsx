import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletedPayload,
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
      events.saleInvoice.onCreated,
      this.handleUpdateTransactionsOnItemCreated
    );
    bus.subscribe(
      events.saleInvoice.onDeleted,
      this.handleDeletePaymentLinkOnInvoiceDeleted
    );
  }

  /**
   * Updates the Plaid item transactions
   * @param {IPlaidItemCreatedEventPayload} payload - Event payload.
   */
  private handleUpdateTransactionsOnItemCreated = async ({
    saleInvoice,
    saleInvoiceId,
    tenantId,
    trx,
  }: ISaleInvoiceCreatedPayload) => {
    runAfterTransaction(trx, async () => {
      await this.invoiceStripePaymentLink.createPaymentLink(
        tenantId,
        saleInvoice
      );
    });
  };

  /**
   * Deletes the Stripe payment link once the associated invoice deleted.
   * @param {ISaleInvoiceDeletedPayload}
   */
  private handleDeletePaymentLinkOnInvoiceDeleted = async ({
    saleInvoiceId,
    tenantId,
  }: ISaleInvoiceDeletedPayload) => {
    await this.deleteStripePaymentLinkInvoice.deletePaymentLink(
      tenantId,
      saleInvoiceId
    );
    
  };
}
