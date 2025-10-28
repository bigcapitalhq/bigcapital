import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ISaleInvoiceEditingPayload } from '../SaleInvoice.types';
import { InvoicePaymentsGLEntriesRewrite } from '../InvoicePaymentsGLRewrite';

@Injectable()
export class InvoicePaymentGLRewriteSubscriber {
  constructor(
    private readonly invoicePaymentsRewriteGLEntries: InvoicePaymentsGLEntriesRewrite,
  ) {}

  /**
   * Writes associated invoiceso of payment receive once edit.
   * @param {ISaleInvoiceEditingPayload} -
   */
  @OnEvent(events.saleInvoice.onEdited)
  async paymentGLEntriesRewriteOnPaymentEdit({
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceEditingPayload) {
    await this.invoicePaymentsRewriteGLEntries.invoicePaymentsGLEntriesRewrite(
      oldSaleInvoice.id,
      trx,
    );
  }
}
