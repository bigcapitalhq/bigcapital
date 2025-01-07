import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import {
  IRefundVendorCreditCreatingPayload,
  IRefundVendorCreditDeletingPayload,
} from '@/modules/VendorCreditsRefund/types/VendorCreditRefund.types';
import {
  IVendorCreditCreatingPayload,
  IVendorCreditDeletingPayload,
  IVendorCreditEditingPayload,
} from '@/modules/VendorCredit/types/VendorCredit.types';
import {
  IBillCreatingPayload,
  IBillEditingPayload,
  IBillEventDeletingPayload,
} from '@/modules/Bills/Bills.types';
import {
  IBillPaymentCreatingPayload,
  IBillPaymentEditingPayload,
} from '@/modules/BillPayments/types/BillPayments.types';
import { IBillPaymentDeletingPayload } from '@/modules/BillPayments/types/BillPayments.types';
import { PurchasesTransactionLockingGuard } from '../guards/PurchasesTransactionLockingGuard';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PurchasesTransactionLockingGuardSubscriber {
  constructor(
    public readonly purchasesTransactionsLocking: PurchasesTransactionLockingGuard,
  ) {}

  /**
   * ---------------------------------------------
   * PAYMENT MADES.
   * ---------------------------------------------
   */
  /**
   * Transaction locking guard on payment editing.
   * @param {IBillPaymentEditingPayload}
   */
  @OnEvent(events.billPayment.onEditing)
  public async transactionLockingGuardOnPaymentEditing({
    oldBillPayment,
    billPaymentDTO,
  }: IBillPaymentEditingPayload) {
    // Validate old payment date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      oldBillPayment.paymentDate,
    );
    // Validate the new payment date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      billPaymentDTO.paymentDate,
    );
  }

  /**
   * Transaction locking guard on payment creating.
   * @param {IBillPaymentCreatingPayload}
   */
  @OnEvent(events.billPayment.onCreating)
  public async transactionLockingGuardOnPaymentCreating({
    billPaymentDTO,
  }: IBillPaymentCreatingPayload) {
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      billPaymentDTO.paymentDate,
    );
  }

  /**
   * Transaction locking guard on payment deleting.
   * @param {IBillPaymentDeletingPayload} payload -
   */
  @OnEvent(events.billPayment.onDeleting)
  public async transactionLockingGuardOnPaymentDeleting({
    oldBillPayment,
  }: IBillPaymentDeletingPayload) {
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      oldBillPayment.paymentDate,
    );
  }

  /**
   * ---------------------------------------------
   * BILLS.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on bill creating.
   * @param {IBillCreatingPayload} payload
   */
  @OnEvent(events.bill.onCreating)
  public async transactionLockingGuardOnBillCreating({
    billDTO,
  }: IBillCreatingPayload) {
    // Can't continue if the new bill is not published.
    if (!billDTO.open) return;

    await this.purchasesTransactionsLocking.transactionLockingGuard(
      billDTO.billDate,
    );
  }

  /**
   * Transaction locking guard on bill editing.
   * @param {IBillEditingPayload} payload
   */
  @OnEvent(events.bill.onEditing)
  public async transactionLockingGuardOnBillEditing({
    oldBill,
    billDTO,
  }: IBillEditingPayload) {
    // Can't continue if the old and new bill are not published.
    if (!oldBill.isOpen && !billDTO.open) return;

    // Validate the old bill date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      oldBill.billDate,
    );
    // Validate the new bill date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      billDTO.billDate,
    );
  }

  /**
   * Transaction locking guard on bill deleting.
   * @param {IBillEventDeletingPayload} payload
   */
  @OnEvent(events.bill.onDeleting)
  public async transactionLockingGuardOnBillDeleting({
    oldBill,
  }: IBillEventDeletingPayload) {
    // Can't continue if the old bill is not published.
    if (!oldBill.isOpen) return;

    await this.purchasesTransactionsLocking.transactionLockingGuard(
      oldBill.billDate,
    );
  }

  /**
   * ---------------------------------------------
   * VENDOR CREDITS.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on vendor credit creating.
   * @param {IVendorCreditCreatingPayload} payload
   */
  @OnEvent(events.vendorCredit.onCreating)
  public async transactionLockingGuardOnVendorCreditCreating({
    vendorCreditCreateDTO,
  }: IVendorCreditCreatingPayload) {
    // Can't continue if the new vendor credit is not published.
    if (!vendorCreditCreateDTO.open) return;

    await this.purchasesTransactionsLocking.transactionLockingGuard(
      vendorCreditCreateDTO.vendorCreditDate,
    );
  }

  /**
   * Transaction locking guard on vendor credit deleting.
   * @param {IVendorCreditDeletingPayload} payload
   */
  @OnEvent(events.vendorCredit.onDeleting)
  public async transactionLockingGuardOnVendorCreditDeleting({
    oldVendorCredit,
  }: IVendorCreditDeletingPayload) {
    // Can't continue if the old vendor credit is not open.
    if (!oldVendorCredit.isOpen) return;

    await this.purchasesTransactionsLocking.transactionLockingGuard(
      oldVendorCredit.vendorCreditDate,
    );
  }

  /**
   * Transaction locking guard on vendor credit editing.
   * @param {IVendorCreditEditingPayload} payload
   */
  @OnEvent(events.vendorCredit.onEditing)
  public async transactionLockingGuardOnVendorCreditEditing({
    oldVendorCredit,
    vendorCreditDTO,
  }: IVendorCreditEditingPayload) {
    // Can't continue if the old and new vendor credit are not published.
    if (!oldVendorCredit.isPublished && !vendorCreditDTO.open) return;

    // Validate the old credit date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      oldVendorCredit.vendorCreditDate,
    );
    // Validate the new credit date.
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      vendorCreditDTO.vendorCreditDate,
    );
  }

  /**
   * Transaction locking guard on refund vendor credit creating.
   * @param {IRefundVendorCreditCreatingPayload} payload -
   */
  @OnEvent(events.vendorCredit.onRefundCreating)
  public async transactionLockingGuardOnRefundVendorCredit({
    refundVendorCreditDTO,
  }: IRefundVendorCreditCreatingPayload) {
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      refundVendorCreditDTO.date,
    );
  }

  /**
   * Transaction locking guard on refund vendor credit deleting.
   * @param {IRefundVendorCreditDeletingPayload} payload
   */
  @OnEvent(events.vendorCredit.onRefundDeleting)
  public async transactionLockingGuardOnRefundCreditDeleting({
    oldRefundCredit,
  }: IRefundVendorCreditDeletingPayload) {
    await this.purchasesTransactionsLocking.transactionLockingGuard(
      oldRefundCredit.date,
    );
  }
}
