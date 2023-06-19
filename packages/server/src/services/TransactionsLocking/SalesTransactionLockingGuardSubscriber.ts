import { Service, Inject } from 'typedi';
import {
  ISaleReceiptCreatingPayload,
  IRefundCreditNoteCreatingPayload,
  ISaleInvoiceCreatingPaylaod,
  ISaleReceiptDeletingPayload,
  ICreditNoteDeletingPayload,
  IPaymentReceiveCreatingPayload,
  IRefundCreditNoteDeletingPayload,
  IPaymentReceiveDeletingPayload,
  ISaleEstimateDeletingPayload,
  ISaleEstimateCreatingPayload,
  ISaleEstimateEditingPayload,
  ISaleInvoiceWriteoffCreatePayload,
  ISaleInvoiceEditingPayload,
  ISaleInvoiceDeletePayload,
  ISaleInvoiceWrittenOffCancelPayload,
  ICreditNoteEditingPayload,
  ISaleReceiptEditingPayload,
  IPaymentReceiveEditingPayload,
  ISaleReceiptEventClosingPayload,
  ICreditNoteCreatingPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import SalesTransactionLockingGuard from './SalesTransactionLockingGuard';

@Service()
export default class SalesTransactionLockingGuardSubscriber {
  @Inject()
  salesLockingGuard: SalesTransactionLockingGuard;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    // Sale invoice.
    bus.subscribe(
      events.saleInvoice.onCreating,
      this.transactionLockingGuardOnInvoiceCreating
    );
    bus.subscribe(
      events.saleInvoice.onEditing,
      this.transactionLockingGuardOnInvoiceEditing
    );
    bus.subscribe(
      events.saleInvoice.onWriteoff,
      this.transactionLockingGuardOnInvoiceWritingoff
    );
    bus.subscribe(
      events.saleInvoice.onWrittenoffCancel,
      this.transactionLockingGuardOnInvoiceWritingoffCanceling
    );
    bus.subscribe(
      events.saleInvoice.onDeleting,
      this.transactionLockingGuardOnInvoiceDeleting
    );

    // Sale receipt
    bus.subscribe(
      events.saleReceipt.onCreating,
      this.transactionLockingGuardOnReceiptCreating
    );
    bus.subscribe(
      events.saleReceipt.onDeleting,
      this.transactionLockingGuardOnReceiptDeleting
    );
    bus.subscribe(
      events.saleReceipt.onEditing,
      this.transactionLockingGuardOnReceiptEditing
    );
    bus.subscribe(
      events.saleReceipt.onClosing,
      this.transactionLockingGuardOnReceiptClosing
    );

    // Payment receive
    bus.subscribe(
      events.paymentReceive.onCreating,
      this.transactionLockingGuardOnPaymentCreating
    );
    bus.subscribe(
      events.paymentReceive.onEditing,
      this.transactionLockingGuardOnPaymentEditing
    );
    bus.subscribe(
      events.paymentReceive.onDeleting,
      this.transactionLockingGuardPaymentDeleting
    );

    // Credit note.
    bus.subscribe(
      events.creditNote.onCreating,
      this.transactionLockingGuardOnCreditCreating
    );
    bus.subscribe(
      events.creditNote.onEditing,
      this.transactionLockingGuardOnCreditEditing
    );
    bus.subscribe(
      events.creditNote.onDeleting,
      this.transactionLockingGuardOnCreditDeleting
    );
    bus.subscribe(
      events.creditNote.onRefundCreating,
      this.transactionLockingGuardOnCreditRefundCreating
    );
    bus.subscribe(
      events.creditNote.onRefundDeleting,
      this.transactionLockingGuardOnCreditRefundDeleting
    );

    // Sale Estimate
    bus.subscribe(
      events.saleEstimate.onCreating,
      this.transactionLockingGuardOnEstimateCreating
    );
    bus.subscribe(
      events.saleEstimate.onDeleting,
      this.transactionLockingGuardOnEstimateDeleting
    );
    bus.subscribe(
      events.saleEstimate.onEditing,
      this.transactionLockingGuardOnEstimateEditing
    );
  };

  /**
   * ---------------------------------------------
   * SALES INVOICES.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on invoice creating.
   * @param {ISaleInvoiceCreatingPaylaod} payload
   */
  private transactionLockingGuardOnInvoiceCreating = async ({
    saleInvoiceDTO,
    tenantId,
  }: ISaleInvoiceCreatingPaylaod) => {
    // Can't continue if the new invoice is not published yet.
    if (!saleInvoiceDTO.delivered) return;

    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      saleInvoiceDTO.invoiceDate
    );
  };

  /**
   * Transaction locking guard on invoice editing.
   * @param {ISaleInvoiceEditingPayload} payload
   */
  private transactionLockingGuardOnInvoiceEditing = async ({
    tenantId,
    oldSaleInvoice,
    saleInvoiceDTO,
  }: ISaleInvoiceEditingPayload) => {
    // Can't continue if the old and new invoice are not published yet.
    if (!oldSaleInvoice.isDelivered && !saleInvoiceDTO.delivered) return;

    // Validate the old invoice date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldSaleInvoice.invoiceDate
    );
    // Validate the new invoice date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      saleInvoiceDTO.invoiceDate
    );
  };

  /**
   * Transaction locking guard on invoice deleting.
   * @param {ISaleInvoiceDeletePayload} payload
   */
  private transactionLockingGuardOnInvoiceDeleting = async ({
    saleInvoice,
    tenantId,
  }: ISaleInvoiceDeletePayload) => {
    // Can't continue if the old invoice not published.
    if (!saleInvoice.isDelivered) return;

    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      saleInvoice.invoiceDate
    );
  };

  /**
   * Transaction locking guard on invoice writingoff.
   * @param {ISaleInvoiceWriteoffCreatePayload} payload
   */
  private transactionLockingGuardOnInvoiceWritingoff = async ({
    tenantId,
    saleInvoice,
  }: ISaleInvoiceWriteoffCreatePayload) => {
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      saleInvoice.invoiceDate
    );
  };

  /**
   * Transaciton locking guard on canceling written-off invoice.
   * @param {ISaleInvoiceWrittenOffCancelPayload} payload
   */
  private transactionLockingGuardOnInvoiceWritingoffCanceling = async ({
    tenantId,
    saleInvoice,
  }: ISaleInvoiceWrittenOffCancelPayload) => {
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      saleInvoice.invoiceDate
    );
  };

  /**
   * ---------------------------------------------
   * SALES RECEIPTS.
   * ---------------------------------------------
   */

  /**
   * Transaction  locking guard on receipt creating.
   * @param {ISaleReceiptCreatingPayload}
   */
  private transactionLockingGuardOnReceiptCreating = async ({
    tenantId,
    saleReceiptDTO,
  }: ISaleReceiptCreatingPayload) => {
    // Can't continue if the sale receipt is not published.
    if (!saleReceiptDTO.closed) return;

    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      saleReceiptDTO.receiptDate
    );
  };

  /**
   * Transaction locking guard on receipt creating.
   * @param {ISaleReceiptDeletingPayload}
   */
  private transactionLockingGuardOnReceiptDeleting = async ({
    tenantId,
    oldSaleReceipt,
  }: ISaleReceiptDeletingPayload) => {
    if (!oldSaleReceipt.isClosed) return;

    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldSaleReceipt.receiptDate
    );
  };

  /**
   * Transaction locking guard on sale receipt editing.
   * @param {ISaleReceiptEditingPayload} payload
   */
  private transactionLockingGuardOnReceiptEditing = async ({
    tenantId,
    oldSaleReceipt,
    saleReceiptDTO,
  }: ISaleReceiptEditingPayload) => {
    // Validate the old receipt date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldSaleReceipt.receiptDate
    );
    // Validate the new receipt date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      saleReceiptDTO.receiptDate
    );
  };

  /**
   * Transaction locking guard on sale receipt closing.
   * @param {ISaleReceiptEventClosingPayload} payload
   */
  private transactionLockingGuardOnReceiptClosing = async ({
    tenantId,
    oldSaleReceipt,
  }: ISaleReceiptEventClosingPayload) => {
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldSaleReceipt.receiptDate
    );
  };

  /**
   * ---------------------------------------------
   * CREDIT NOTES.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on credit note deleting.
   * @param {ICreditNoteDeletingPayload} payload -
   */
  private transactionLockingGuardOnCreditDeleting = async ({
    oldCreditNote,
    tenantId,
  }: ICreditNoteDeletingPayload) => {
    // Can't continue if the old credit is not published.
    if (!oldCreditNote.isPublished) return;

    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldCreditNote.creditNoteDate
    );
  };

  /**
   * Transaction locking guard on credit note creating.
   * @param {ICreditNoteCreatingPayload} payload
   */
  private transactionLockingGuardOnCreditCreating = async ({
    tenantId,
    creditNoteDTO,
  }: ICreditNoteCreatingPayload) => {
    // Can't continue if the new credit is still draft.
    if (!creditNoteDTO.open) return;

    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      creditNoteDTO.creditNoteDate
    );
  };

  /**
   * Transaction locking guard on credit note editing.
   * @param {ICreditNoteEditingPayload} payload -
   */
  private transactionLockingGuardOnCreditEditing = async ({
    creditNoteEditDTO,
    oldCreditNote,
    tenantId,
  }: ICreditNoteEditingPayload) => {
    // Can't continue if the new and old credit note are not published yet.
    if (!creditNoteEditDTO.open && !oldCreditNote.isPublished) return;

    // Validate the old credit date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldCreditNote.creditNoteDate
    );
    // Validate the new credit date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      creditNoteEditDTO.creditNoteDate
    );
  };

  /**
   * Transaction locking guard on payment deleting.
   * @param {IRefundCreditNoteDeletingPayload} paylaod -
   */
  private transactionLockingGuardOnCreditRefundDeleting = async ({
    tenantId,
    oldRefundCredit,
  }: IRefundCreditNoteDeletingPayload) => {
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldRefundCredit.date
    );
  };

  /**
   * Transaction locking guard on refund credit note creating.
   * @param {IRefundCreditNoteCreatingPayload} payload -
   */
  private transactionLockingGuardOnCreditRefundCreating = async ({
    tenantId,
    newCreditNoteDTO,
  }: IRefundCreditNoteCreatingPayload) => {
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      newCreditNoteDTO.date
    );
  };

  /**
   * ---------------------------------------------
   * SALES ESTIMATES.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on estimate creating.
   * @param {ISaleEstimateCreatingPayload} payload -
   */
  private transactionLockingGuardOnEstimateCreating = async ({
    estimateDTO,
    tenantId,
  }: ISaleEstimateCreatingPayload) => {
    // Can't continue if the new estimate is not published yet.
    if (!estimateDTO.delivered) return;

    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      estimateDTO.estimateDate
    );
  };

  /**
   * Transaction locking guard on estimate deleting.
   * @param {ISaleEstimateDeletingPayload} payload
   */
  private transactionLockingGuardOnEstimateDeleting = async ({
    oldSaleEstimate,
    tenantId,
  }: ISaleEstimateDeletingPayload) => {
    // Can't continue if the old estimate is not published.
    if (!oldSaleEstimate.isDelivered) return;

    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldSaleEstimate.estimateDate
    );
  };

  /**
   * Transaction locking guard on estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private transactionLockingGuardOnEstimateEditing = async ({
    tenantId,
    oldSaleEstimate,
    estimateDTO,
  }: ISaleEstimateEditingPayload) => {
    // Can't continue if the new and old estimate transactions are not published yet.
    if (!estimateDTO.delivered && !oldSaleEstimate.isDelivered) return;

    // Validate the old estimate date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldSaleEstimate.estimateDate
    );
    // Validate the new estimate date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      estimateDTO.estimateDate
    );
  };

  /**
   * ---------------------------------------------
   * PAYMENT RECEIVES.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on payment receive editing.
   * @param {IPaymentReceiveEditingPayload}
   */
  private transactionLockingGuardOnPaymentEditing = async ({
    tenantId,
    oldPaymentReceive,
    paymentReceiveDTO,
  }: IPaymentReceiveEditingPayload) => {
    // Validate the old payment date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldPaymentReceive.paymentDate
    );
    // Validate the new payment date.
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      paymentReceiveDTO.paymentDate
    );
  };

  /**
   * Transaction locking guard on payment creating.
   * @param {IPaymentReceiveCreatingPayload}
   */
  private transactionLockingGuardOnPaymentCreating = async ({
    tenantId,
    paymentReceiveDTO,
  }: IPaymentReceiveCreatingPayload) => {
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      paymentReceiveDTO.paymentDate
    );
  };

  /**
   * Transaction locking guard on payment deleting.
   * @param {IPaymentReceiveDeletingPayload} payload -
   */
  private transactionLockingGuardPaymentDeleting = async ({
    oldPaymentReceive,
    tenantId,
  }: IPaymentReceiveDeletingPayload) => {
    await this.salesLockingGuard.transactionLockingGuard(
      tenantId,
      oldPaymentReceive.paymentDate
    );
  };
}
