import { ISaleInvoiceEditingPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { InvoicePaymentsGLEntriesRewrite } from '../InvoicePaymentsGLRewrite';

@Service()
export class InvoicePaymentGLRewriteSubscriber {
  @Inject()
  private invoicePaymentsRewriteGLEntries: InvoicePaymentsGLEntriesRewrite;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(events.saleInvoice.onEdited, this.paymentGLEntriesRewriteOnPaymentEdit);
    return bus;
  };

  /**
   * Writes associated invoiceso of payment receive once edit.
   * @param {ISaleInvoiceEditingPayload} -
   */
  private paymentGLEntriesRewriteOnPaymentEdit = async ({
    tenantId,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceEditingPayload) => {
    await this.invoicePaymentsRewriteGLEntries.invoicePaymentsGLEntriesRewrite(tenantId, oldSaleInvoice.id, trx);
  };
}
