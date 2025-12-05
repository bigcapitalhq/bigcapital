import { events } from '@/common/events/events';
import { SalesTransactionLockingGuard } from '../guards/SalesTransactionLockingGuard';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceDeletePayload,
  ISaleInvoiceEditingPayload,
  ISaleInvoiceWriteoffCreatePayload,
  ISaleInvoiceWrittenOffCancelPayload,
} from '@/modules/SaleInvoices/SaleInvoice.types';
import {
  IPaymentReceivedCreatingPayload,
  IPaymentReceivedEditingPayload,
  IPaymentReceivedDeletingPayload,
} from '@/modules/PaymentReceived/types/PaymentReceived.types';
import {
  ISaleEstimateCreatingPayload,
  ISaleEstimateDeletingPayload,
} from '@/modules/SaleEstimates/types/SaleEstimates.types';
import { ISaleEstimateEditingPayload } from '@/modules/SaleEstimates/types/SaleEstimates.types';
import { IRefundCreditNoteDeletingPayload } from '@/modules/CreditNoteRefunds/types/CreditNoteRefunds.types';
import { IRefundCreditNoteCreatingPayload } from '@/modules/CreditNoteRefunds/types/CreditNoteRefunds.types';
import {
  ICreditNoteCreatingPayload,
  ICreditNoteDeletingPayload,
} from '@/modules/CreditNotes/types/CreditNotes.types';
import { ICreditNoteEditingPayload } from '@/modules/CreditNotes/types/CreditNotes.types';
import {
  ISaleReceiptCreatingPayload,
  ISaleReceiptDeletingPayload,
  ISaleReceiptEditingPayload,
} from '@/modules/SaleReceipts/types/SaleReceipts.types';
import { ISaleReceiptEventClosingPayload } from '@/modules/SaleReceipts/types/SaleReceipts.types';

@Injectable()
export class SalesTransactionLockingGuardSubscriber {
  constructor(
    public readonly salesLockingGuard: SalesTransactionLockingGuard,
  ) { }

  /**
   * ---------------------------------------------
   * SALES INVOICES.
   * ---------------------------------------------
   */
  /**
   * Transaction locking guard on invoice creating.
   * @param {ISaleInvoiceCreatingPaylaod} payload
   */
  @OnEvent(events.saleInvoice.onCreating, { suppressErrors: false })
  public async transactionLockingGuardOnInvoiceCreating({
    saleInvoiceDTO,
  }: ISaleInvoiceCreatingPaylaod) {
    // Can't continue if the new invoice is not published yet.
    if (!saleInvoiceDTO.delivered) return;

    await this.salesLockingGuard.transactionLockingGuard(
      saleInvoiceDTO.invoiceDate,
    );
  }

  /**
   * Transaction locking guard on invoice editing.
   * @param {ISaleInvoiceEditingPayload} payload
   */
  @OnEvent(events.saleInvoice.onEditing, { suppressErrors: false })
  public async transactionLockingGuardOnInvoiceEditing({
    oldSaleInvoice,
    saleInvoiceDTO,
  }: ISaleInvoiceEditingPayload) {
    // Can't continue if the old and new invoice are not published yet.
    if (!oldSaleInvoice.isDelivered && !saleInvoiceDTO.delivered) return;

    // Validate the old invoice date.
    await this.salesLockingGuard.transactionLockingGuard(
      oldSaleInvoice.invoiceDate,
    );
    // Validate the new invoice date.
    await this.salesLockingGuard.transactionLockingGuard(
      saleInvoiceDTO.invoiceDate,
    );
  }

  /**
   * Transaction locking guard on invoice deleting.
   * @param {ISaleInvoiceDeletePayload} payload
   */
  @OnEvent(events.saleInvoice.onDelete, { suppressErrors: false })
  public async transactionLockingGuardOnInvoiceDeleting({
    oldSaleInvoice,
  }: ISaleInvoiceDeletePayload) {
    // Can't continue if the old invoice not published.
    if (!oldSaleInvoice.isDelivered) return;

    await this.salesLockingGuard.transactionLockingGuard(
      oldSaleInvoice.invoiceDate,
    );
  }

  /**
   * Transaction locking guard on invoice writingoff.
   * @param {ISaleInvoiceWriteoffCreatePayload} payload
   */
  @OnEvent(events.saleInvoice.onWriteoff, { suppressErrors: false })
  public async transactionLockinGuardOnInvoiceWritingoff({
    saleInvoice,
  }: ISaleInvoiceWriteoffCreatePayload) {
    await this.salesLockingGuard.transactionLockingGuard(
      saleInvoice.invoiceDate,
    );
  }

  /**
   * Transaciton locking guard on canceling written-off invoice.
   * @param {ISaleInvoiceWrittenOffCancelPayload} payload
   */
  @OnEvent(events.saleInvoice.onWrittenoffCancel, { suppressErrors: false })
  public async transactionLockinGuardOnInvoiceWritingoffCanceling({
    saleInvoice,
  }: ISaleInvoiceWrittenOffCancelPayload) {
    await this.salesLockingGuard.transactionLockingGuard(
      saleInvoice.invoiceDate,
    );
  }

  /**
   * ---------------------------------------------
   * SALES RECEIPTS.
   * ---------------------------------------------
   */

  /**
   * Transaction  locking guard on receipt creating.
   * @param {ISaleReceiptCreatingPayload}
   */
  @OnEvent(events.saleReceipt.onCreating, { suppressErrors: false })
  public async transactionLockingGuardOnReceiptCreating({
    saleReceiptDTO,
  }: ISaleReceiptCreatingPayload) {
    // Can't continue if the sale receipt is not published.
    if (!saleReceiptDTO.closed) return;

    await this.salesLockingGuard.transactionLockingGuard(
      saleReceiptDTO.receiptDate,
    );
  }

  /**
   * Transaction locking guard on receipt creating.
   * @param {ISaleReceiptDeletingPayload}
   */
  @OnEvent(events.saleReceipt.onDeleting, { suppressErrors: false })
  public async transactionLockingGuardOnReceiptDeleting({
    oldSaleReceipt,
  }: ISaleReceiptDeletingPayload) {
    if (!oldSaleReceipt.isClosed) return;

    await this.salesLockingGuard.transactionLockingGuard(
      oldSaleReceipt.receiptDate,
    );
  }

  /**
   * Transaction locking guard on sale receipt editing.
   * @param {ISaleReceiptEditingPayload} payload
   */
  @OnEvent(events.saleReceipt.onEditing, { suppressErrors: false })
  public async transactionLockingGuardOnReceiptEditing({
    oldSaleReceipt,
    saleReceiptDTO,
  }: ISaleReceiptEditingPayload) {
    // Validate the old receipt date.
    await this.salesLockingGuard.transactionLockingGuard(
      oldSaleReceipt.receiptDate,
    );
    // Validate the new receipt date.
    await this.salesLockingGuard.transactionLockingGuard(
      saleReceiptDTO.receiptDate,
    );
  }

  /**
   * Transaction locking guard on sale receipt closing.
   * @param {ISaleReceiptEventClosingPayload} payload
   */
  @OnEvent(events.saleReceipt.onClosing, { suppressErrors: false })
  public async transactionLockingGuardOnReceiptClosing({
    oldSaleReceipt,
  }: ISaleReceiptEventClosingPayload) {
    await this.salesLockingGuard.transactionLockingGuard(
      oldSaleReceipt.receiptDate,
    );
  }

  /**
   * ---------------------------------------------
   * CREDIT NOTES.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on credit note deleting.
   * @param {ICreditNoteDeletingPayload} payload -
   */
  @OnEvent(events.creditNote.onDeleting, { suppressErrors: false })
  public async transactionLockingGuardOnCreditDeleting({
    oldCreditNote,
  }: ICreditNoteDeletingPayload) {
    // Can't continue if the old credit is not published.
    if (!oldCreditNote.isPublished) return;

    await this.salesLockingGuard.transactionLockingGuard(
      oldCreditNote.creditNoteDate,
    );
  }

  /**
   * Transaction locking guard on credit note creating.
   * @param {ICreditNoteCreatingPayload} payload
   */
  @OnEvent(events.creditNote.onCreating, { suppressErrors: false })
  public async transactionLockingGuardOnCreditCreating({
    creditNoteDTO,
  }: ICreditNoteCreatingPayload) {
    // Can't continue if the new credit is still draft.
    if (!creditNoteDTO.open) return;

    await this.salesLockingGuard.transactionLockingGuard(
      creditNoteDTO.creditNoteDate,
    );
  }

  /**
   * Transaction locking guard on credit note editing.
   * @param {ICreditNoteEditingPayload} payload -
   */
  @OnEvent(events.creditNote.onEditing, { suppressErrors: false })
  public async transactionLockingGuardOnCreditEditing({
    creditNoteEditDTO,
    oldCreditNote,
  }: ICreditNoteEditingPayload) {
    // Can't continue if the new and old credit note are not published yet.
    if (!creditNoteEditDTO.open && !oldCreditNote.isPublished) return;

    // Validate the old credit date.
    await this.salesLockingGuard.transactionLockingGuard(
      oldCreditNote.creditNoteDate,
    );
    // Validate the new credit date.
    await this.salesLockingGuard.transactionLockingGuard(
      creditNoteEditDTO.creditNoteDate,
    );
  }

  /**
   * Transaction locking guard on payment deleting.
   * @param {IRefundCreditNoteDeletingPayload} paylaod -
   */
  @OnEvent(events.creditNote.onRefundDeleting, { suppressErrors: false })
  public async transactionLockingGuardOnCreditRefundDeleteing({
    oldRefundCredit,
  }: IRefundCreditNoteDeletingPayload) {
    await this.salesLockingGuard.transactionLockingGuard(oldRefundCredit.date);
  }

  /**
   * Transaction locking guard on refund credit note creating.
   * @param {IRefundCreditNoteCreatingPayload} payload -
   */
  @OnEvent(events.creditNote.onRefundCreating, { suppressErrors: false })
  public async transactionLockingGuardOnCreditRefundCreating({
    newCreditNoteDTO,
  }: IRefundCreditNoteCreatingPayload) {
    await this.salesLockingGuard.transactionLockingGuard(newCreditNoteDTO.date);
  }

  /**
   * ---------------------------------------------
   * SALES ESTIMATES.
   * ---------------------------------------------
   */
  /**
   * Transaction locking guard on estimate creating.
   * @param {ISaleEstimateCreatingPayload} payload -
   */
  @OnEvent(events.saleEstimate.onCreating, { suppressErrors: false })
  public async transactionLockingGuardOnEstimateCreating({
    estimateDTO,
  }: ISaleEstimateCreatingPayload) {
    // Can't continue if the new estimate is not published yet.
    if (!estimateDTO.delivered) return;

    await this.salesLockingGuard.transactionLockingGuard(
      estimateDTO.estimateDate,
    );
  }

  /**
   * Transaction locking guard on estimate deleting.
   * @param {ISaleEstimateDeletingPayload} payload
   */
  @OnEvent(events.saleEstimate.onDeleting, { suppressErrors: false })
  public async transactionLockingGuardOnEstimateDeleting({
    oldSaleEstimate,
  }: ISaleEstimateDeletingPayload) {
    // Can't continue if the old estimate is not published.
    if (!oldSaleEstimate.isDelivered) return;

    await this.salesLockingGuard.transactionLockingGuard(
      oldSaleEstimate.estimateDate,
    );
  }

  /**
   * Transaction locking guard on estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  @OnEvent(events.saleEstimate.onEditing, { suppressErrors: false })
  public async transactionLockingGuardOnEstimateEditing({
    oldSaleEstimate,
    estimateDTO,
  }: ISaleEstimateEditingPayload) {
    // Can't continue if the new and old estimate transactions are not published yet.
    if (!estimateDTO.delivered && !oldSaleEstimate.isDelivered) return;

    // Validate the old estimate date.
    await this.salesLockingGuard.transactionLockingGuard(
      oldSaleEstimate.estimateDate,
    );
    // Validate the new estimate date.
    await this.salesLockingGuard.transactionLockingGuard(
      estimateDTO.estimateDate,
    );
  }

  /**
   * ---------------------------------------------
   * PAYMENT RECEIVES.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on payment receive editing.
   * @param {IPaymentReceivedEditingPayload}
   */
  @OnEvent(events.paymentReceive.onEditing, { suppressErrors: false })
  public async transactionLockingGuardOnPaymentEditing({
    oldPaymentReceive,
    paymentReceiveDTO,
  }: IPaymentReceivedEditingPayload) {
    // Validate the old payment date.
    await this.salesLockingGuard.transactionLockingGuard(
      oldPaymentReceive.paymentDate,
    );
    // Validate the new payment date.
    await this.salesLockingGuard.transactionLockingGuard(
      paymentReceiveDTO.paymentDate,
    );
  }

  /**
   * Transaction locking guard on payment creating.
   * @param {IPaymentReceivedCreatingPayload}
   */
  @OnEvent(events.paymentReceive.onCreating, { suppressErrors: false })
  public async transactionLockingGuardOnPaymentCreating({
    paymentReceiveDTO,
  }: IPaymentReceivedCreatingPayload) {
    await this.salesLockingGuard.transactionLockingGuard(
      paymentReceiveDTO.paymentDate,
    );
  }

  /**
   * Transaction locking guard on payment deleting.
   * @param {IPaymentReceivedDeletingPayload} payload -
   */
  @OnEvent(events.paymentReceive.onDeleting, { suppressErrors: false })
  public async transactionLockingGuardPaymentDeleting({
    oldPaymentReceive,
  }: IPaymentReceivedDeletingPayload) {
    await this.salesLockingGuard.transactionLockingGuard(
      oldPaymentReceive.paymentDate,
    );
  }
}
