import { IBillEditedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { BillPaymentsGLEntriesRewrite } from './BillPaymentsGLEntriesRewrite';

@Service()
export class BillPaymentsGLEntriesRewriteSubscriber {
  @Inject()
  private billPaymentGLEntriesRewrite: BillPaymentsGLEntriesRewrite;

  /**
   * Attaches events with handles.
   */
  public attach(bus) {
    bus.subscribe(events.bill.onEdited, this.handlerRewritePaymentsGLOnBillEdited);
  }

  /**
   * Handles writing journal entries once bill created.
   * @param {IBillCreatedPayload} payload -
   */
  private handlerRewritePaymentsGLOnBillEdited = async ({ tenantId, billId, trx }: IBillEditedPayload) => {
    await this.billPaymentGLEntriesRewrite.rewriteBillPaymentsGLEntries(tenantId, billId, trx);
  };
}
