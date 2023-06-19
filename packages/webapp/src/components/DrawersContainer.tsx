import React from 'react';

import AccountDrawer from '@/containers/Drawers/AccountDrawer';
import ManualJournalDrawer from '@/containers/Drawers/ManualJournalDrawer';
import ExpenseDrawer from '@/containers/Drawers/ExpenseDrawer';
import BillDrawer from '@/containers/Drawers/BillDrawer';
import InvoiceDetailDrawer from '@/containers/Drawers/InvoiceDetailDrawer';
import ReceiptDetailDrawer from '@/containers/Drawers/ReceiptDetailDrawer';
import PaymentReceiveDetailDrawer from '@/containers/Drawers/PaymentReceiveDetailDrawer';
import PaymentMadeDetailDrawer from '@/containers/Drawers/PaymentMadeDetailDrawer';
import EstimateDetailDrawer from '@/containers/Drawers/EstimateDetailDrawer';
import ItemDetailDrawer from '@/containers/Drawers/ItemDetailDrawer';
import CustomerDetailsDrawer from '@/containers/Drawers/CustomerDetailsDrawer';
import VendorDetailsDrawer from '@/containers/Drawers/VendorDetailsDrawer';
import InventoryAdjustmentDetailDrawer from '@/containers/Drawers/InventoryAdjustmentDetailDrawer';
import CashflowTransactionDetailDrawer from '@/containers/Drawers/CashflowTransactionDetailDrawer';
import QuickCreateCustomerDrawer from '@/containers/Drawers/QuickCreateCustomerDrawer';
import QuickCreateItemDrawer from '@/containers/Drawers/QuickCreateItemDrawer';
import QuickWriteVendorDrawer from '@/containers/Drawers/QuickWriteVendorDrawer';
import CreditNoteDetailDrawer from '@/containers/Drawers/CreditNoteDetailDrawer';
import VendorCreditDetailDrawer from '@/containers/Drawers/VendorCreditDetailDrawer';
import RefundCreditNoteDetailDrawer from '@/containers/Drawers/RefundCreditNoteDetailDrawer';
import RefundVendorCreditDetailDrawer from '@/containers/Drawers/RefundVendorCreditDetailDrawer';
import WarehouseTransferDetailDrawer from '@/containers/Drawers/WarehouseTransferDetailDrawer';

import { DRAWERS } from '@/constants/drawers';

/**
 * Drawers container of the dashboard.
 */
export default function DrawersContainer() {
  return (
    <div>
      <AccountDrawer name={DRAWERS.ACCOUNT_DETAILS} />
      <ManualJournalDrawer name={DRAWERS.JOURNAL_DETAILS} />
      <ExpenseDrawer name={DRAWERS.EXPENSE_DETAILS} />
      <BillDrawer name={DRAWERS.BILL_DETAILS} />
      <InvoiceDetailDrawer name={DRAWERS.INVOICE_DETAILS} />
      <EstimateDetailDrawer name={DRAWERS.ESTIMATE_DETAILS} />
      <ReceiptDetailDrawer name={DRAWERS.RECEIPT_DETAILS} />
      <PaymentReceiveDetailDrawer name={DRAWERS.PAYMENT_RECEIVE_DETAILS} />
      <PaymentMadeDetailDrawer name={DRAWERS.PAYMENT_MADE_DETAILS} />
      <ItemDetailDrawer name={DRAWERS.ITEM_DETAILS} />
      <CustomerDetailsDrawer name={DRAWERS.CUSTOMER_DETAILS} />
      <VendorDetailsDrawer name={DRAWERS.VENDOR_DETAILS} />
      <InventoryAdjustmentDetailDrawer name={DRAWERS.INVENTORY_ADJUSTMENT_DETAILS} />
      <CashflowTransactionDetailDrawer name={DRAWERS.CASHFLOW_TRANSACTION_DETAILS} />
      <QuickCreateCustomerDrawer name={DRAWERS.QUICK_CREATE_CUSTOMER} />
      <QuickCreateItemDrawer name={DRAWERS.QUICK_CREATE_ITEM} />
      <QuickWriteVendorDrawer name={DRAWERS.QUICK_WRITE_VENDOR} />
      <CreditNoteDetailDrawer name={DRAWERS.CREDIT_NOTE_DETAILS} />
      <VendorCreditDetailDrawer name={DRAWERS.VENDOR_CREDIT_DETAILS} />
      <RefundCreditNoteDetailDrawer name={DRAWERS.REFUND_CREDIT_NOTE_DETAILS} />
      <RefundVendorCreditDetailDrawer name={DRAWERS.REFUND_VENDOR_CREDIT_DETAILS} />
      <WarehouseTransferDetailDrawer name={DRAWERS.WAREHOUSE_TRANSFER_DETAILS} />
    </div>
  );
}
