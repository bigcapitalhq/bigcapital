import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { ISaleInvoiceEditingPayload } from '@/interfaces';
import { InvoicePaymentsGLEntriesRewrite } from '../InvoicePaymentsGLRewrite';

@Service()
export class InvoicePaymentGLRewriteSubscriber {
  @Inject()
  private invoicePaymentsRewriteGLEntries: InvoicePaymentsGLEntriesRewrite;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.saleInvoice.onEdited,
      this.paymentGLEntriesRewriteOnPaymentEdit
    );
    return bus;
  };

  /**
   * Writes associated invoices of payment receive once edit.
   * @param {ISaleInvoiceEditingPayload} -
   */
  private paymentGLEntriesRewriteOnPaymentEdit = async ({
    tenantId,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceEditingPayload) => {
    await this.invoicePaymentsRewriteGLEntries.invoicePaymentsGLEntriesRewrite(
      tenantId,
      oldSaleInvoice.id,
      trx
    );
  };
}
