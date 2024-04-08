import { IRefundCreditNoteDeletedPayload, IRefundVendorCreditCreatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import RefundVendorCreditGLEntries from './RefundVendorCreditGLEntries';

@Service()
export default class RefundVendorCreditGLEntriesSubscriber {
  @Inject()
  refundVendorGLEntries: RefundVendorCreditGLEntries;

  /**
   * Attaches events with handlers.
   */
  attach(bus) {
    bus.subscribe(events.vendorCredit.onRefundCreated, this.writeRefundVendorCreditGLEntriesOnceCreated);
    bus.subscribe(events.vendorCredit.onRefundDeleted, this.revertRefundVendorCreditOnceDeleted);
  }

  /**
   * Writes refund vendor credit GL entries once the transaction created.
   * @param {IRefundCreditNoteCreatedPayload} payload -
   */
  private writeRefundVendorCreditGLEntriesOnceCreated = async ({
    tenantId,
    trx,
    refundVendorCredit,
  }: IRefundVendorCreditCreatedPayload) => {
    await this.refundVendorGLEntries.saveRefundCreditGLEntries(tenantId, refundVendorCredit.id, trx);
  };

  /**
   * Reverts refund vendor credit GL entries once the transaction deleted.
   * @param {IRefundCreditNoteDeletedPayload} payload -
   */
  private revertRefundVendorCreditOnceDeleted = async ({
    tenantId,
    trx,
    refundCreditId,
  }: IRefundCreditNoteDeletedPayload) => {
    await this.refundVendorGLEntries.revertRefundCreditGLEntries(tenantId, refundCreditId, trx);
  };
}
