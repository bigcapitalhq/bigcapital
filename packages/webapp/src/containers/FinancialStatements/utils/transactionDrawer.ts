import { DRAWERS } from '@/constants/drawers';

export interface TransactionReference {
  referenceType: string;
  referenceId: number;
}

type OpenDrawer = (name: string, payload?: Record<string, unknown>) => void;

/**
 * Maps the transaction reference types to the detail drawer name and its
 * payload key.
 */
const TRANSACTION_DRAWER_META: Record<string, { drawer: string; key: string }> =
  {
    SaleInvoice: { drawer: DRAWERS.INVOICE_DETAILS, key: 'invoiceId' },
    SaleReceipt: { drawer: DRAWERS.RECEIPT_DETAILS, key: 'receiptId' },
    PaymentReceive: {
      drawer: DRAWERS.PAYMENT_RECEIVED_DETAILS,
      key: 'paymentReceiveId',
    },
    Bill: { drawer: DRAWERS.BILL_DETAILS, key: 'billId' },
    BillPayment: {
      drawer: DRAWERS.PAYMENT_MADE_DETAILS,
      key: 'paymentMadeId',
    },
    Expense: { drawer: DRAWERS.EXPENSE_DETAILS, key: 'expenseId' },
    Journal: { drawer: DRAWERS.JOURNAL_DETAILS, key: 'manualJournalId' },
    ManualJournal: {
      drawer: DRAWERS.JOURNAL_DETAILS,
      key: 'manualJournalId',
    },
    InventoryAdjustment: {
      drawer: DRAWERS.INVENTORY_ADJUSTMENT_DETAILS,
      key: 'inventoryId',
    },
    CreditNote: { drawer: DRAWERS.CREDIT_NOTE_DETAILS, key: 'creditNoteId' },
    VendorCredit: {
      drawer: DRAWERS.VENDOR_CREDIT_DETAILS,
      key: 'vendorCreditId',
    },
    Estimate: { drawer: DRAWERS.ESTIMATE_DETAILS, key: 'estimateId' },
    WarehouseTransfer: {
      drawer: DRAWERS.WAREHOUSE_TRANSFER_DETAILS,
      key: 'warehouseTransferId',
    },
    RefundCreditNote: {
      drawer: DRAWERS.REFUND_CREDIT_NOTE_DETAILS,
      key: 'refundTransactionId',
    },
    RefundVendorCredit: {
      drawer: DRAWERS.REFUND_VENDOR_CREDIT_DETAILS,
      key: 'refundTransactionId',
    },
    CashflowTransaction: {
      drawer: DRAWERS.CASHFLOW_TRNASACTION_DETAILS,
      key: 'referenceId',
    },
    OwnerDrawing: {
      drawer: DRAWERS.CASHFLOW_TRNASACTION_DETAILS,
      key: 'referenceId',
    },
    OwnerContribution: {
      drawer: DRAWERS.CASHFLOW_TRNASACTION_DETAILS,
      key: 'referenceId',
    },
    TransferFromAccount: {
      drawer: DRAWERS.CASHFLOW_TRNASACTION_DETAILS,
      key: 'referenceId',
    },
    TransferToAccount: {
      drawer: DRAWERS.CASHFLOW_TRNASACTION_DETAILS,
      key: 'referenceId',
    },
    OtherIncome: {
      drawer: DRAWERS.CASHFLOW_TRNASACTION_DETAILS,
      key: 'referenceId',
    },
    OtherExpense: {
      drawer: DRAWERS.CASHFLOW_TRNASACTION_DETAILS,
      key: 'referenceId',
    },
  };

/**
 * Opens the detail drawer of the given transaction reference, if any
 * associated drawer exists. The `defaultDrawer` is used as a fallback for
 * references without a dedicated detail drawer (e.g. cashflow transactions).
 */
export const handleViewTransactionDetail = (
  reference: TransactionReference,
  openDrawer: OpenDrawer,
  defaultDrawer?: string,
) => {
  const meta = TRANSACTION_DRAWER_META[reference.referenceType];

  if (meta) {
    return openDrawer(meta.drawer, { [meta.key]: reference.referenceId });
  }
  if (defaultDrawer) {
    return openDrawer(defaultDrawer, { referenceId: reference.referenceId });
  }
};
