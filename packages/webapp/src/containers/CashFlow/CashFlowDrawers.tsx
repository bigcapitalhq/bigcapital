import { DRAWERS } from '@/constants/drawers';
import { CategorizeTransactionDrawer } from '@/containers/CashFlow/CategorizeTransaction/drawers/CategorizeTransactionDrawer/CategorizeTransactionDrawer';
import { index as AccountDrawer } from '@/containers/Drawers/AccountDrawer';
import { index as CashflowTransactionDetailDrawer } from '@/containers/Drawers/CashflowTransactionDetailDrawer';
import { index as ExpenseDrawer } from '@/containers/Drawers/ExpenseDrawer';
import { index as InventoryAdjustmentDetailDrawer } from '@/containers/Drawers/InventoryAdjustmentDetailDrawer';
import { index as ManualJournalDrawer } from '@/containers/Drawers/ManualJournalDrawer';
import { index as PaymentMadeDetailDrawer } from '@/containers/Drawers/PaymentMadeDetailDrawer';
import { index as PaymentReceiveDetailDrawer } from '@/containers/Drawers/PaymentReceiveDetailDrawer';
import { index as ReceiptDetailDrawer } from '@/containers/Drawers/ReceiptDetailDrawer';
import { index as RefundCreditNoteDetailDrawer } from '@/containers/Drawers/RefundCreditNoteDetailDrawer';
import { index as RefundVendorCreditDetailDrawer } from '@/containers/Drawers/RefundVendorCreditDetailDrawer';

export function CashFlowDrawers() {
  return (
    <>
      <AccountDrawer name={DRAWERS.ACCOUNT_DETAILS} />
      <ManualJournalDrawer name={DRAWERS.JOURNAL_DETAILS} />
      <ExpenseDrawer name={DRAWERS.EXPENSE_DETAILS} />
      <ReceiptDetailDrawer name={DRAWERS.RECEIPT_DETAILS} />
      <PaymentReceiveDetailDrawer name={DRAWERS.PAYMENT_RECEIVED_DETAILS} />
      <PaymentMadeDetailDrawer name={DRAWERS.PAYMENT_MADE_DETAILS} />
      <InventoryAdjustmentDetailDrawer
        name={DRAWERS.INVENTORY_ADJUSTMENT_DETAILS}
      />
      <CashflowTransactionDetailDrawer
        name={DRAWERS.CASHFLOW_TRNASACTION_DETAILS}
      />
      <RefundCreditNoteDetailDrawer name={DRAWERS.REFUND_CREDIT_NOTE_DETAILS} />
      <RefundVendorCreditDetailDrawer
        name={DRAWERS.REFUND_VENDOR_CREDIT_DETAILS}
      />
      <CategorizeTransactionDrawer name={DRAWERS.CATEGORIZE_TRANSACTION} />
    </>
  );
}
