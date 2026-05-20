import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { events } from '@/common/events/events';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { AuditLogService } from '../AuditLog.service';
import {
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
  IBillOpenedPayload,
} from '@/modules/Bills/Bills.types';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceEditedPayload,
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEventDeliveredPayload,
  ISaleInvoiceWrittenOffCanceledPayload,
  ISaleInvoiceWriteoffCreatePayload,
} from '@/modules/SaleInvoices/SaleInvoice.types';
import {
  ISaleReceiptCreatedPayload,
  ISaleReceiptEditedPayload,
  ISaleReceiptEventDeletedPayload,
} from '@/modules/SaleReceipts/types/SaleReceipts.types';
import {
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedEditedPayload,
  IPaymentReceivedDeletedPayload,
} from '@/modules/PaymentReceived/types/PaymentReceived.types';
import {
  IBillPaymentEventCreatedPayload,
  IBillPaymentEventEditedPayload,
  IBillPaymentEventDeletedPayload,
} from '@/modules/BillPayments/types/BillPayments.types';
import {
  IExpenseCreatedPayload,
  IExpenseEventEditPayload,
  IExpenseEventDeletePayload,
  IExpenseEventPublishedPayload,
} from '@/modules/Expenses/Expenses.types';
import {
  ICreditNoteCreatedPayload,
  ICreditNoteEditedPayload,
  ICreditNoteDeletedPayload,
  ICreditNoteOpenedPayload,
} from '@/modules/CreditNotes/types/CreditNotes.types';
import {
  IVendorCreditCreatedPayload,
  IVendorCreditEditedPayload,
  IVendorCreditDeletedPayload,
  IVendorCreditOpenedPayload,
} from '@/modules/VendorCredit/types/VendorCredit.types';
import {
  IManualJournalEventCreatedPayload,
  IManualJournalEventEditedPayload,
  IManualJournalEventDeletedPayload,
  IManualJournalEventPublishedPayload,
} from '@/modules/ManualJournals/types/ManualJournals.types';
import {
  ICommandCashflowCreatedPayload,
  ICommandCashflowDeletedPayload,
  ICashflowTransactionCategorizedPayload,
} from '@/modules/BankingTransactions/types/BankingTransactions.types';
import {
  IAccountEventCreatedPayload,
  IAccountEventDeletedPayload,
  IAccountEventActivatedPayload,
} from '@/interfaces/Account';
import {
  IInventoryAdjustmentEventCreatedPayload,
  IInventoryAdjustmentEventPublishedPayload,
  IInventoryAdjustmentEventDeletedPayload,
} from '@/modules/InventoryAdjutments/types/InventoryAdjustments.types';
import {
  IWarehouseTransferCreated,
  IWarehouseTransferEditedPayload,
  IWarehouseTransferDeletedPayload,
  IWarehouseTransferInitiatedPayload,
  IWarehouseTransferTransferredPayload,
} from '@/modules/Warehouses/Warehouse.types';
import {
  ITransactionsLockingPartialUnlocked,
  ITransactionsLockingCanceled,
} from '@/modules/TransactionsLocking/types/TransactionsLocking.types';
import {
  ISaleEstimateCreatedPayload,
  ISaleEstimateEditedPayload,
  ISaleEstimateDeletedPayload,
} from '@/modules/SaleEstimates/types/SaleEstimates.types';
import { IRefundCreditNoteCreatedPayload } from '@/modules/CreditNoteRefunds/types/CreditNoteRefunds.types';
import { IRefundVendorCreditCreatedPayload } from '@/modules/VendorCreditsRefund/types/VendorCreditRefund.types';

@Injectable()
export class FinancialAuditLogSubscriber {
  constructor(private readonly auditLog: AuditLogService) {}

  private async write(
    trx: Knex.Transaction | undefined,
    action: string,
    subject: string,
    subjectId: number | null,
    metadata: Record<string, unknown>,
  ) {
    await this.auditLog.record({ trx, action, subject, subjectId, metadata });
  }

  // --- Bills ---
  @OnEvent(events.bill.onCreated)
  async onBillCreated({ bill, trx }: IBillCreatedPayload) {
    await this.write(trx, 'created', AbilitySubject.Bill, bill.id, {
      billNumber: bill.billNumber,
      amount: bill.amount,
      currencyCode: bill.currencyCode,
    });
  }

  @OnEvent(events.bill.onEdited)
  async onBillEdited({ bill, trx }: IBillEditedPayload) {
    await this.write(trx, 'edited', AbilitySubject.Bill, bill.id, {
      billNumber: bill.billNumber,
      amount: bill.amount,
      currencyCode: bill.currencyCode,
    });
  }

  @OnEvent(events.bill.onDeleted)
  async onBillDeleted({ billId, oldBill, trx }: IBIllEventDeletedPayload) {
    await this.write(trx, 'deleted', AbilitySubject.Bill, billId, {
      billNumber: oldBill.billNumber,
    });
  }

  @OnEvent(events.bill.onOpened)
  async onBillOpened({ bill, trx }: IBillOpenedPayload) {
    await this.write(trx, 'opened', AbilitySubject.Bill, bill.id, {
      billNumber: bill.billNumber,
    });
  }

  // --- Sale invoices ---
  @OnEvent(events.saleInvoice.onCreated)
  async onSaleInvoiceCreated({
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload) {
    await this.write(trx, 'created', AbilitySubject.SaleInvoice, saleInvoice.id, {
      invoiceNumber: saleInvoice.invoiceNo,
      balance: saleInvoice.balance,
      currencyCode: saleInvoice.currencyCode,
    });
  }

  @OnEvent(events.saleInvoice.onEdited)
  async onSaleInvoiceEdited({ saleInvoice, trx }: ISaleInvoiceEditedPayload) {
    await this.write(trx, 'edited', AbilitySubject.SaleInvoice, saleInvoice.id, {
      invoiceNumber: saleInvoice.invoiceNo,
      balance: saleInvoice.balance,
      currencyCode: saleInvoice.currencyCode,
    });
  }

  @OnEvent(events.saleInvoice.onDeleted)
  async onSaleInvoiceDeleted({
    saleInvoiceId,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceDeletedPayload) {
    await this.write(
      trx,
      'deleted',
      AbilitySubject.SaleInvoice,
      saleInvoiceId,
      { invoiceNumber: oldSaleInvoice.invoiceNo },
    );
  }

  @OnEvent(events.saleInvoice.onDelivered)
  async onSaleInvoiceDelivered({
    saleInvoice,
    trx,
  }: ISaleInvoiceEventDeliveredPayload) {
    await this.write(trx, 'delivered', AbilitySubject.SaleInvoice, saleInvoice.id, {
      invoiceNumber: saleInvoice.invoiceNo,
    });
  }

  @OnEvent(events.saleInvoice.onWrittenoff)
  async onSaleInvoiceWrittenoff({
    saleInvoice,
    trx,
  }: ISaleInvoiceWriteoffCreatePayload) {
    await this.write(trx, 'writtenoff', AbilitySubject.SaleInvoice, saleInvoice.id, {
      invoiceNumber: saleInvoice.invoiceNo,
    });
  }

  @OnEvent(events.saleInvoice.onWrittenoffCanceled)
  async onSaleInvoiceWrittenoffCanceled({
    saleInvoice,
    trx,
  }: ISaleInvoiceWrittenOffCanceledPayload) {
    await this.write(
      trx,
      'writtenoff_canceled',
      AbilitySubject.SaleInvoice,
      saleInvoice.id,
      { invoiceNumber: saleInvoice.invoiceNo },
    );
  }

  // --- Sale receipts ---
  @OnEvent(events.saleReceipt.onCreated)
  async onSaleReceiptCreated({ saleReceipt, trx }: ISaleReceiptCreatedPayload) {
    await this.write(trx, 'created', AbilitySubject.SaleReceipt, saleReceipt.id, {
      receiptNumber: saleReceipt.receiptNumber,
      amount: saleReceipt.total,
      currencyCode: saleReceipt.currencyCode,
    });
  }

  @OnEvent(events.saleReceipt.onEdited)
  async onSaleReceiptEdited({ saleReceipt, trx }: ISaleReceiptEditedPayload) {
    await this.write(trx, 'edited', AbilitySubject.SaleReceipt, saleReceipt.id, {
      receiptNumber: saleReceipt.receiptNumber,
      amount: saleReceipt.total,
      currencyCode: saleReceipt.currencyCode,
    });
  }

  @OnEvent(events.saleReceipt.onDeleted)
  async onSaleReceiptDeleted({
    saleReceiptId,
    oldSaleReceipt,
    trx,
  }: ISaleReceiptEventDeletedPayload) {
    await this.write(
      trx,
      'deleted',
      AbilitySubject.SaleReceipt,
      saleReceiptId,
      { receiptNumber: oldSaleReceipt.receiptNumber },
    );
  }

  // --- Payments received ---
  @OnEvent(events.paymentReceive.onCreated)
  async onPaymentReceivedCreated({
    paymentReceive,
    trx,
  }: IPaymentReceivedCreatedPayload) {
    await this.write(
      trx,
      'created',
      AbilitySubject.PaymentReceive,
      paymentReceive.id,
      {
        paymentReceiveNo: paymentReceive.paymentReceiveNo,
        amount: paymentReceive.amount,
        currencyCode: paymentReceive.currencyCode,
      },
    );
  }

  @OnEvent(events.paymentReceive.onEdited)
  async onPaymentReceivedEdited({
    paymentReceive,
    trx,
  }: IPaymentReceivedEditedPayload) {
    await this.write(
      trx,
      'edited',
      AbilitySubject.PaymentReceive,
      paymentReceive.id,
      {
        paymentReceiveNo: paymentReceive.paymentReceiveNo,
        amount: paymentReceive.amount,
      },
    );
  }

  @OnEvent(events.paymentReceive.onDeleted)
  async onPaymentReceivedDeleted({
    paymentReceiveId,
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedDeletedPayload) {
    await this.write(
      trx,
      'deleted',
      AbilitySubject.PaymentReceive,
      paymentReceiveId,
      { paymentReceiveNo: oldPaymentReceive.paymentReceiveNo },
    );
  }

  // --- Bill payments (payments made) ---
  @OnEvent(events.billPayment.onCreated)
  async onBillPaymentCreated({
    billPayment,
    trx,
  }: IBillPaymentEventCreatedPayload) {
    await this.write(
      trx,
      'created',
      AbilitySubject.PaymentMade,
      billPayment.id,
      {
        paymentNumber: billPayment.paymentNumber,
        amount: billPayment.amount,
        currencyCode: billPayment.currencyCode,
      },
    );
  }

  @OnEvent(events.billPayment.onEdited)
  async onBillPaymentEdited({
    billPayment,
    trx,
  }: IBillPaymentEventEditedPayload) {
    await this.write(
      trx,
      'edited',
      AbilitySubject.PaymentMade,
      billPayment.id,
      {
        paymentNumber: billPayment.paymentNumber,
        amount: billPayment.amount,
      },
    );
  }

  @OnEvent(events.billPayment.onDeleted)
  async onBillPaymentDeleted({
    billPaymentId,
    oldBillPayment,
    trx,
  }: IBillPaymentEventDeletedPayload) {
    await this.write(
      trx,
      'deleted',
      AbilitySubject.PaymentMade,
      billPaymentId,
      { paymentNumber: oldBillPayment.paymentNumber },
    );
  }

  // --- Expenses ---
  @OnEvent(events.expenses.onCreated)
  async onExpenseCreated({ expense, expenseId, trx }: IExpenseCreatedPayload) {
    await this.write(trx, 'created', AbilitySubject.Expense, expenseId, {
      amount: expense.totalAmount,
      currencyCode: expense.currencyCode,
    });
  }

  @OnEvent(events.expenses.onEdited)
  async onExpenseEdited({ expense, expenseId, trx }: IExpenseEventEditPayload) {
    await this.write(trx, 'edited', AbilitySubject.Expense, expenseId, {
      amount: expense.totalAmount,
      currencyCode: expense.currencyCode,
    });
  }

  @OnEvent(events.expenses.onDeleted)
  async onExpenseDeleted({ expenseId, oldExpense, trx }: IExpenseEventDeletePayload) {
    await this.write(trx, 'deleted', AbilitySubject.Expense, expenseId, {
      amount: oldExpense.totalAmount,
    });
  }

  @OnEvent(events.expenses.onPublished)
  async onExpensePublished({ expense, expenseId, trx }: IExpenseEventPublishedPayload) {
    await this.write(trx, 'published', AbilitySubject.Expense, expenseId, {
      amount: expense.totalAmount,
      currencyCode: expense.currencyCode,
    });
  }

  // --- Credit notes ---
  @OnEvent(events.creditNote.onCreated)
  async onCreditNoteCreated({ creditNote, trx }: ICreditNoteCreatedPayload) {
    await this.write(trx, 'created', AbilitySubject.CreditNote, creditNote.id, {
      creditNoteNumber: creditNote.creditNoteNumber,
      amount: creditNote.total,
      currencyCode: creditNote.currencyCode,
    });
  }

  @OnEvent(events.creditNote.onEdited)
  async onCreditNoteEdited({ creditNote, trx }: ICreditNoteEditedPayload) {
    await this.write(trx, 'edited', AbilitySubject.CreditNote, creditNote.id, {
      creditNoteNumber: creditNote.creditNoteNumber,
      amount: creditNote.total,
    });
  }

  @OnEvent(events.creditNote.onDeleted)
  async onCreditNoteDeleted({
    creditNoteId,
    oldCreditNote,
    trx,
  }: ICreditNoteDeletedPayload) {
    await this.write(
      trx,
      'deleted',
      AbilitySubject.CreditNote,
      creditNoteId,
      { creditNoteNumber: oldCreditNote.creditNoteNumber },
    );
  }

  @OnEvent(events.creditNote.onOpened)
  async onCreditNoteOpened({ creditNote, trx }: ICreditNoteOpenedPayload) {
    await this.write(trx, 'opened', AbilitySubject.CreditNote, creditNote.id, {
      creditNoteNumber: creditNote.creditNoteNumber,
    });
  }

  @OnEvent(events.creditNote.onRefundCreated)
  async onCreditNoteRefundCreated({
    trx,
    refundCreditNote,
    creditNote,
  }: IRefundCreditNoteCreatedPayload) {
    await this.write(trx, 'refund_created', 'CreditNoteRefund', refundCreditNote.id, {
      creditNoteId: creditNote.id,
      amount: refundCreditNote.amount,
    });
  }

  // --- Vendor credits ---
  @OnEvent(events.vendorCredit.onCreated)
  async onVendorCreditCreated({ vendorCredit, trx }: IVendorCreditCreatedPayload) {
    await this.write(
      trx,
      'created',
      AbilitySubject.VendorCredit,
      vendorCredit.id,
      {
        vendorCreditNumber: vendorCredit.vendorCreditNumber,
        total: vendorCredit.total,
        currencyCode: vendorCredit.currencyCode,
      },
    );
  }

  @OnEvent(events.vendorCredit.onEdited)
  async onVendorCreditEdited({ vendorCredit, trx }: IVendorCreditEditedPayload) {
    await this.write(
      trx,
      'edited',
      AbilitySubject.VendorCredit,
      vendorCredit.id,
      {
        vendorCreditNumber: vendorCredit.vendorCreditNumber,
        total: vendorCredit.total,
      },
    );
  }

  @OnEvent(events.vendorCredit.onDeleted)
  async onVendorCreditDeleted({
    vendorCreditId,
    oldVendorCredit,
    trx,
  }: IVendorCreditDeletedPayload) {
    await this.write(
      trx,
      'deleted',
      AbilitySubject.VendorCredit,
      vendorCreditId,
      { vendorCreditNumber: oldVendorCredit.vendorCreditNumber },
    );
  }

  @OnEvent(events.vendorCredit.onOpened)
  async onVendorCreditOpened({
    vendorCredit,
    vendorCreditId,
    trx,
  }: IVendorCreditOpenedPayload) {
    await this.write(trx, 'opened', AbilitySubject.VendorCredit, vendorCreditId, {
      vendorCreditNumber: vendorCredit.vendorCreditNumber,
    });
  }

  @OnEvent(events.vendorCredit.onRefundCreated)
  async onVendorCreditRefundCreated({
    trx,
    refundVendorCredit,
    vendorCredit,
  }: IRefundVendorCreditCreatedPayload) {
    await this.write(
      trx,
      'refund_created',
      'VendorCreditRefund',
      refundVendorCredit.id,
      { vendorCreditId: vendorCredit.id, amount: refundVendorCredit.amount },
    );
  }

  // --- Manual journals ---
  @OnEvent(events.manualJournals.onCreated)
  async onManualJournalCreated({
    manualJournal,
    trx,
  }: IManualJournalEventCreatedPayload) {
    await this.write(
      trx,
      'created',
      AbilitySubject.ManualJournal,
      manualJournal.id,
      {
        journalNumber: manualJournal.journalNumber,
        amount: manualJournal.amount,
        currencyCode: manualJournal.currencyCode,
      },
    );
  }

  @OnEvent(events.manualJournals.onEdited)
  async onManualJournalEdited({
    manualJournal,
    trx,
  }: IManualJournalEventEditedPayload) {
    await this.write(
      trx,
      'edited',
      AbilitySubject.ManualJournal,
      manualJournal.id,
      {
        journalNumber: manualJournal.journalNumber,
        amount: manualJournal.amount,
      },
    );
  }

  @OnEvent(events.manualJournals.onDeleted)
  async onManualJournalDeleted({
    manualJournalId,
    trx,
  }: IManualJournalEventDeletedPayload) {
    await this.write(trx, 'deleted', AbilitySubject.ManualJournal, manualJournalId, {});
  }

  @OnEvent(events.manualJournals.onPublished)
  async onManualJournalPublished({
    manualJournal,
    trx,
  }: IManualJournalEventPublishedPayload) {
    await this.write(
      trx,
      'published',
      AbilitySubject.ManualJournal,
      manualJournal.id,
      { journalNumber: manualJournal.journalNumber },
    );
  }

  // --- Cashflow ---
  @OnEvent(events.cashflow.onTransactionCreated)
  async onCashflowCreated({
    cashflowTransaction,
    trx,
  }: ICommandCashflowCreatedPayload) {
    await this.write(trx, 'created', AbilitySubject.Cashflow, cashflowTransaction.id, {
      amount: cashflowTransaction.amount,
      currencyCode: cashflowTransaction.currencyCode,
    });
  }

  @OnEvent(events.cashflow.onTransactionDeleted)
  async onCashflowDeleted({
    cashflowTransactionId,
    trx,
  }: ICommandCashflowDeletedPayload) {
    await this.write(trx, 'deleted', AbilitySubject.Cashflow, cashflowTransactionId, {});
  }

  @OnEvent(events.cashflow.onTransactionCategorized)
  async onCashflowCategorized({
    cashflowTransaction,
    trx,
  }: ICashflowTransactionCategorizedPayload) {
    await this.write(
      trx,
      'categorized',
      AbilitySubject.Cashflow,
      cashflowTransaction.id,
      { amount: cashflowTransaction.amount },
    );
  }

  // --- GL accounts ---
  @OnEvent(events.accounts.onCreated)
  async onAccountCreated({ account, accountId, trx }: IAccountEventCreatedPayload) {
    await this.write(trx, 'created', AbilitySubject.Account, accountId, {
      name: account.name,
      code: account.code,
    });
  }

  @OnEvent(events.accounts.onDeleted)
  async onAccountDeleted({ accountId, oldAccount, trx }: IAccountEventDeletedPayload) {
    await this.write(trx, 'deleted', AbilitySubject.Account, accountId, {
      name: oldAccount.name,
      code: oldAccount.code,
    });
  }

  @OnEvent(events.accounts.onActivated)
  async onAccountActivated({ accountId, trx }: IAccountEventActivatedPayload) {
    await this.write(trx, 'activated', AbilitySubject.Account, accountId, {});
  }

  // --- Inventory adjustments ---
  @OnEvent(events.inventoryAdjustment.onQuickCreated)
  async onInventoryAdjustmentCreated({
    inventoryAdjustment,
    inventoryAdjustmentId,
    trx,
  }: IInventoryAdjustmentEventCreatedPayload) {
    await this.write(
      trx,
      'created',
      AbilitySubject.InventoryAdjustment,
      inventoryAdjustmentId,
      { reason: inventoryAdjustment.reason },
    );
  }

  @OnEvent(events.inventoryAdjustment.onPublished)
  async onInventoryAdjustmentPublished({
    inventoryAdjustment,
    inventoryAdjustmentId,
    trx,
  }: IInventoryAdjustmentEventPublishedPayload) {
    await this.write(
      trx,
      'published',
      AbilitySubject.InventoryAdjustment,
      inventoryAdjustmentId,
      { reason: inventoryAdjustment.reason },
    );
  }

  @OnEvent(events.inventoryAdjustment.onDeleted)
  async onInventoryAdjustmentDeleted({
    inventoryAdjustmentId,
    trx,
  }: IInventoryAdjustmentEventDeletedPayload) {
    await this.write(
      trx,
      'deleted',
      AbilitySubject.InventoryAdjustment,
      inventoryAdjustmentId,
      {},
    );
  }

  // --- Warehouse transfers ---
  @OnEvent(events.warehouseTransfer.onCreated)
  async onWarehouseTransferCreated({
    warehouseTransfer,
    trx,
  }: IWarehouseTransferCreated) {
    await this.write(
      trx,
      'created',
      'WarehouseTransfer',
      warehouseTransfer.id,
      {
        transactionNumber: (warehouseTransfer as { transactionNumber?: string })
          .transactionNumber,
      },
    );
  }

  @OnEvent(events.warehouseTransfer.onEdited)
  async onWarehouseTransferEdited({
    warehouseTransfer,
    trx,
  }: IWarehouseTransferEditedPayload) {
    await this.write(
      trx,
      'edited',
      'WarehouseTransfer',
      warehouseTransfer.id,
      {
        transactionNumber: (warehouseTransfer as { transactionNumber?: string })
          .transactionNumber,
      },
    );
  }

  @OnEvent(events.warehouseTransfer.onDeleted)
  async onWarehouseTransferDeleted({
    oldWarehouseTransfer,
    trx,
  }: IWarehouseTransferDeletedPayload) {
    await this.write(
      trx,
      'deleted',
      'WarehouseTransfer',
      oldWarehouseTransfer.id,
      {},
    );
  }

  @OnEvent(events.warehouseTransfer.onInitiated)
  async onWarehouseTransferInitiated({
    warehouseTransfer,
    trx,
  }: IWarehouseTransferInitiatedPayload) {
    await this.write(
      trx,
      'initiated',
      'WarehouseTransfer',
      warehouseTransfer.id,
      {
        transactionNumber: (warehouseTransfer as { transactionNumber?: string })
          .transactionNumber,
      },
    );
  }

  @OnEvent(events.warehouseTransfer.onTransferred)
  async onWarehouseTransferTransferred({
    warehouseTransfer,
    trx,
  }: IWarehouseTransferTransferredPayload) {
    await this.write(
      trx,
      'transferred',
      'WarehouseTransfer',
      warehouseTransfer.id,
      {
        transactionNumber: (warehouseTransfer as { transactionNumber?: string })
          .transactionNumber,
      },
    );
  }

  // --- Transactions locking (settings change; no trx on payload) ---
  @OnEvent(events.transactionsLocking.partialUnlocked)
  async onTransactionsLockingChanged(
    payload: ITransactionsLockingPartialUnlocked | ITransactionsLockingCanceled,
  ) {
    const meta: Record<string, unknown> = { module: payload.module };
    if ('transactionLockingDTO' in payload && payload.transactionLockingDTO) {
      meta.lockToDate = (payload.transactionLockingDTO as { lockToDate?: Date })
        .lockToDate;
    }
    if ('cancelLockingDTO' in payload && payload.cancelLockingDTO) {
      meta.cancelReason = (payload.cancelLockingDTO as { reason?: string }).reason;
    }
    await this.write(undefined, 'locking_changed', 'TransactionsLocking', null, meta);
  }

  // --- Sale estimates ---
  @OnEvent(events.saleEstimate.onCreated)
  async onSaleEstimateCreated({
    saleEstimate,
    saleEstimateId,
    trx,
  }: ISaleEstimateCreatedPayload) {
    await this.write(
      trx,
      'created',
      AbilitySubject.SaleEstimate,
      saleEstimate?.id ?? saleEstimateId,
      {
        estimateNumber: saleEstimate.estimateNumber,
        total: saleEstimate.total,
        currencyCode: saleEstimate.currencyCode,
      },
    );
  }

  @OnEvent(events.saleEstimate.onEdited)
  async onSaleEstimateEdited({
    saleEstimate,
    estimateId,
    trx,
  }: ISaleEstimateEditedPayload) {
    await this.write(trx, 'edited', AbilitySubject.SaleEstimate, estimateId, {
      estimateNumber: saleEstimate.estimateNumber,
      total: saleEstimate.total,
    });
  }

  @OnEvent(events.saleEstimate.onDeleted)
  async onSaleEstimateDeleted({
    saleEstimateId,
    oldSaleEstimate,
    trx,
  }: ISaleEstimateDeletedPayload) {
    await this.write(
      trx,
      'deleted',
      AbilitySubject.SaleEstimate,
      saleEstimateId,
      { estimateNumber: oldSaleEstimate.estimateNumber },
    );
  }
}
