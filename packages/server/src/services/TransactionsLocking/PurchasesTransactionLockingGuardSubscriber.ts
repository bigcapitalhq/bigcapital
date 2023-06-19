import { Inject } from 'typedi';
import events from '@/subscribers/events';
import {
  IBillCreatingPayload,
  IBillEditingPayload,
  IBillEventDeletingPayload,
  IBillPaymentCreatingPayload,
  IBillPaymentDeletingPayload,
  IBillPaymentEditingPayload,
  IRefundVendorCreditCreatingPayload,
  IRefundVendorCreditDeletingPayload,
  IVendorCreditCreatingPayload,
  IVendorCreditDeletingPayload,
  IVendorCreditEditingPayload,
} from '@/interfaces';
import PurchasesTransactionsLocking from './PurchasesTransactionLockingGuard';

export default class PurchasesTransactionLockingGuardSubscriber {
  @Inject()
  purchasesTransactionsLocking: PurchasesTransactionsLocking;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach = (bus) => {
    // Bills
    bus.subscribe(
      events.bill.onCreating,
      this.transactionLockingGuardOnBillCreating
    );
    bus.subscribe(
      events.bill.onEditing,
      this.transactionLockingGuardOnBillEditing
    );
    bus.subscribe(
      events.bill.onDeleting,
      this.transactionLockingGuardOnBillDeleting
    );
    // Payments made.
    bus.subscribe(
      events.billPayment.onCreating,
      this.transactionLockingGuardOnPaymentCreating
    );
    bus.subscribe(
      events.billPayment.onEditing,
      this.transactionLockingGuardOnPaymentEditing
    );
    bus.subscribe(
      events.billPayment.onDeleting,
      this.transactionLockingGuardOnPaymentDeleting
    );
    // Vendor credits.
    bus.subscribe(
      events.vendorCredit.onCreating,
      this.transactionLockingGuardOnVendorCreditCreating
    );
    bus.subscribe(
      events.vendorCredit.onDeleting,
      this.transactionLockingGuardOnVendorCreditDeleting
    );
    bus.subscribe(
      events.vendorCredit.onEditing,
      this.transactionLockingGuardOnVendorCreditEditing
    );
    bus.subscribe(
      events.vendorCredit.onRefundCreating,
      this.transactionLockingGuardOnRefundVendorCredit
    );
    bus.subscribe(
      events.vendorCredit.onRefundDeleting,
      this.transactionLockingGuardOnRefundCreditDeleting
    );
  };

  /**
   * ---------------------------------------------
   * PAYMENTS MADE.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on payment editing.
   * @param {IBillPaymentEditingPayload}
   */
  private transactionLockingGuardOnPaymentEditing = async ({
    tenantId,
    oldBillPayment,
    billPaymentDTO,
  }: IBillPaymentEditingPayload) => {
    // Validate old payment date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldBillPayment.paymentDate
    );
    // Validate the new payment date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      billPaymentDTO.paymentDate
    );
  };

  /**
   * Transaction locking guard on payment creating.
   * @param {IBillPaymentCreatingPayload}
   */
  private transactionLockingGuardOnPaymentCreating = async ({
    tenantId,
    billPaymentDTO,
  }: IBillPaymentCreatingPayload) => {
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      billPaymentDTO.paymentDate
    );
  };

  /**
   * Transaction locking guard on payment deleting.
   * @param {IBillPaymentDeletingPayload} payload -
   */
  private transactionLockingGuardOnPaymentDeleting = async ({
    tenantId,
    oldBillPayment,
  }: IBillPaymentDeletingPayload) => {
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldBillPayment.paymentDate
    );
  };

  /**
   * ---------------------------------------------
   * BILLS.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on bill creating.
   * @param {IBillCreatingPayload} payload
   */
  private transactionLockingGuardOnBillCreating = async ({
    tenantId,
    billDTO,
  }: IBillCreatingPayload) => {
    // Can't continue if the new bill is not published.
    if (!billDTO.open) return;

    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      billDTO.billDate
    );
  };

  /**
   * Transaction locking guard on bill editing.
   * @param {IBillEditingPayload} payload
   */
  private transactionLockingGuardOnBillEditing = async ({
    oldBill,
    tenantId,
    billDTO,
  }: IBillEditingPayload) => {
    // Can't continue if the old and new bill are not published.
    if (!oldBill.isOpen && !billDTO.open) return;

    // Validate the old bill date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldBill.billDate
    );
    // Validate the new bill date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      billDTO.billDate
    );
  };

  /**
   * Transaction locking guard on bill deleting.
   * @param {IBillEventDeletingPayload} payload
   */
  private transactionLockingGuardOnBillDeleting = async ({
    tenantId,
    oldBill,
  }: IBillEventDeletingPayload) => {
    // Can't continue if the old bill is not published.
    if (!oldBill.isOpen) return;

    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldBill.billDate
    );
  };

  /**
   * ---------------------------------------------
   * VENDOR CREDITS.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on vendor credit creating.
   * @param {IVendorCreditCreatingPayload} payload
   */
  private transactionLockingGuardOnVendorCreditCreating = async ({
    tenantId,
    vendorCreditCreateDTO,
  }: IVendorCreditCreatingPayload) => {
    // Can't continue if the new vendor credit is not published.
    if (!vendorCreditCreateDTO.open) return;

    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      vendorCreditCreateDTO.vendorCreditDate
    );
  };

  /**
   * Transaction locking guard on vendor credit deleting.
   * @param {IVendorCreditDeletingPayload} payload
   */
  private transactionLockingGuardOnVendorCreditDeleting = async ({
    tenantId,
    oldVendorCredit,
  }: IVendorCreditDeletingPayload) => {
    // Can't continue if the old vendor credit is not open.
    if (!oldVendorCredit.isOpen) return;

    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldVendorCredit.vendorCreditDate
    );
  };

  /**
   * Transaction locking guard on vendor credit editing.
   * @param {IVendorCreditEditingPayload} payload
   */
  private transactionLockingGuardOnVendorCreditEditing = async ({
    tenantId,
    oldVendorCredit,
    vendorCreditDTO,
  }: IVendorCreditEditingPayload) => {
    // Can't continue if the old and new vendor credit are not published.
    if (!oldVendorCredit.isPublished && !vendorCreditDTO.open) return;

    // Validate the old credit date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldVendorCredit.vendorCreditDate
    );
    // Validate the new credit date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      vendorCreditDTO.vendorCreditDate
    );
  };

  /**
   * Transaction locking guard on refund vendor credit creating.
   * @param {IRefundVendorCreditCreatingPayload} payload -
   */
  private transactionLockingGuardOnRefundVendorCredit = async ({
    tenantId,
    refundVendorCreditDTO,
  }: IRefundVendorCreditCreatingPayload) => {
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      refundVendorCreditDTO.date
    );
  };

  /**
   * Transaction locking guard on refund vendor credit deleting.
   * @param {IRefundVendorCreditDeletingPayload} payload
   */
  private transactionLockingGuardOnRefundCreditDeleting = async ({
    tenantId,
    oldRefundCredit,
  }: IRefundVendorCreditDeletingPayload) => {
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldRefundCredit.date
    );
  };
}
