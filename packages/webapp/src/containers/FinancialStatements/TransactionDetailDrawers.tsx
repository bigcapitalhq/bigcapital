import React from 'react';
import { DRAWERS } from '@/constants/drawers';
import { index as BillDrawer } from '@/containers/Drawers/BillDrawer';
import { index as CashflowTransactionDetailDrawer } from '@/containers/Drawers/CashflowTransactionDetailDrawer';
import { index as CreditNoteDetailDrawer } from '@/containers/Drawers/CreditNoteDetailDrawer';
import { index as EstimateDetailDrawer } from '@/containers/Drawers/EstimateDetailDrawer';
import { index as ExpenseDrawer } from '@/containers/Drawers/ExpenseDrawer';
import { index as InventoryAdjustmentDetailDrawer } from '@/containers/Drawers/InventoryAdjustmentDetailDrawer';
import { index as InvoiceDetailDrawer } from '@/containers/Drawers/InvoiceDetailDrawer';
import { index as ManualJournalDrawer } from '@/containers/Drawers/ManualJournalDrawer';
import { index as PaymentMadeDetailDrawer } from '@/containers/Drawers/PaymentMadeDetailDrawer';
import { index as PaymentReceiveDetailDrawer } from '@/containers/Drawers/PaymentReceiveDetailDrawer';
import { index as ReceiptDetailDrawer } from '@/containers/Drawers/ReceiptDetailDrawer';
import { index as RefundCreditNoteDetailDrawer } from '@/containers/Drawers/RefundCreditNoteDetailDrawer';
import { index as RefundVendorCreditDetailDrawer } from '@/containers/Drawers/RefundVendorCreditDetailDrawer';
import { index as VendorCreditDetailDrawer } from '@/containers/Drawers/VendorCreditDetailDrawer';
import { index as WarehouseTransferDetailDrawer } from '@/containers/Drawers/WarehouseTransferDetailDrawer';

/**
 * Mounts the transaction detail drawers used to preview the transaction
 * referenced by a report row (e.g. general ledger, journal sheet) in a drawer
 * without leaving the current page.
 */
export function TransactionDetailDrawers() {
  return (
    <div>
      <InvoiceDetailDrawer name={DRAWERS.INVOICE_DETAILS} />
      <ReceiptDetailDrawer name={DRAWERS.RECEIPT_DETAILS} />
      <PaymentReceiveDetailDrawer name={DRAWERS.PAYMENT_RECEIVED_DETAILS} />
      <BillDrawer name={DRAWERS.BILL_DETAILS} />
      <PaymentMadeDetailDrawer name={DRAWERS.PAYMENT_MADE_DETAILS} />
      <ExpenseDrawer name={DRAWERS.EXPENSE_DETAILS} />
      <ManualJournalDrawer name={DRAWERS.JOURNAL_DETAILS} />
      <CreditNoteDetailDrawer name={DRAWERS.CREDIT_NOTE_DETAILS} />
      <VendorCreditDetailDrawer name={DRAWERS.VENDOR_CREDIT_DETAILS} />
      <EstimateDetailDrawer name={DRAWERS.ESTIMATE_DETAILS} />
      <InventoryAdjustmentDetailDrawer
        name={DRAWERS.INVENTORY_ADJUSTMENT_DETAILS}
      />
      <WarehouseTransferDetailDrawer
        name={DRAWERS.WAREHOUSE_TRANSFER_DETAILS}
      />
      <RefundCreditNoteDetailDrawer name={DRAWERS.REFUND_CREDIT_NOTE_DETAILS} />
      <RefundVendorCreditDetailDrawer
        name={DRAWERS.REFUND_VENDOR_CREDIT_DETAILS}
      />
      <CashflowTransactionDetailDrawer
        name={DRAWERS.CASHFLOW_TRNASACTION_DETAILS}
      />
    </div>
  );
}
