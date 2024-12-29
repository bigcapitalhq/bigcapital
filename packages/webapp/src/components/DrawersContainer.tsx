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
import TaxRateDetailsDrawer from '@/containers/TaxRates/drawers/TaxRateDetailsDrawer/TaxRateDetailsDrawer';
import CategorizeTransactionDrawer from '@/containers/CashFlow/CategorizeTransaction/drawers/CategorizeTransactionDrawer/CategorizeTransactionDrawer';
import ChangeSubscriptionPlanDrawer from '@/containers/Subscriptions/drawers/ChangeSubscriptionPlanDrawer/ChangeSubscriptionPlanDrawer';
import { InvoiceCustomizeDrawer } from '@/containers/Sales/Invoices/InvoiceCustomize/InvoiceCustomizeDrawer';
import { EstimateCustomizeDrawer } from '@/containers/Sales/Estimates/EstimateCustomize/EstimateCustomizeDrawer';
import { ReceiptCustomizeDrawer } from '@/containers/Sales/Receipts/ReceiptCustomize/ReceiptCustomizeDrawer';
import { CreditNoteCustomizeDrawer } from '@/containers/Sales/CreditNotes/CreditNoteCustomize/CreditNoteCustomizeDrawer';
import { PaymentReceivedCustomizeDrawer } from '@/containers/Sales/PaymentsReceived/PaymentReceivedCustomize/PaymentReceivedCustomizeDrawer';
import { BrandingTemplatesDrawer } from '@/containers/BrandingTemplates/BrandingTemplatesDrawer';

import { DRAWERS } from '@/constants/drawers';
import { InvoiceSendMailDrawer } from '@/containers/Sales/Invoices/InvoiceSendMailDrawer/InvoiceSendMailDrawer';
import { EstimateSendMailDrawer } from '@/containers/Sales/Estimates/EstimateSendMailDrawer';
import { ReceiptSendMailDrawer } from '@/containers/Sales/Receipts/ReceiptSendMailDrawer';
import { PaymentReceivedSendMailDrawer } from '@/containers/Sales/PaymentsReceived/PaymentReceivedMailDrawer';

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
      <PaymentReceiveDetailDrawer name={DRAWERS.PAYMENT_RECEIVED_DETAILS} />
      <PaymentMadeDetailDrawer name={DRAWERS.PAYMENT_MADE_DETAILS} />
      <ItemDetailDrawer name={DRAWERS.ITEM_DETAILS} />
      <CustomerDetailsDrawer name={DRAWERS.CUSTOMER_DETAILS} />
      <VendorDetailsDrawer name={DRAWERS.VENDOR_DETAILS} />
      <InventoryAdjustmentDetailDrawer
        name={DRAWERS.INVENTORY_ADJUSTMENT_DETAILS}
      />
      <CashflowTransactionDetailDrawer
        name={DRAWERS.CASHFLOW_TRNASACTION_DETAILS}
      />
      <QuickCreateCustomerDrawer name={DRAWERS.QUICK_CREATE_CUSTOMER} />
      <QuickCreateItemDrawer name={DRAWERS.QUICK_CREATE_ITEM} />
      <QuickWriteVendorDrawer name={DRAWERS.QUICK_WRITE_VENDOR} />
      <CreditNoteDetailDrawer name={DRAWERS.CREDIT_NOTE_DETAILS} />
      <VendorCreditDetailDrawer name={DRAWERS.VENDOR_CREDIT_DETAILS} />
      <RefundCreditNoteDetailDrawer name={DRAWERS.REFUND_CREDIT_NOTE_DETAILS} />
      <RefundVendorCreditDetailDrawer
        name={DRAWERS.REFUND_VENDOR_CREDIT_DETAILS}
      />
      <WarehouseTransferDetailDrawer
        name={DRAWERS.WAREHOUSE_TRANSFER_DETAILS}
      />
      <TaxRateDetailsDrawer name={DRAWERS.TAX_RATE_DETAILS} />
      <CategorizeTransactionDrawer name={DRAWERS.CATEGORIZE_TRANSACTION} />
      <ChangeSubscriptionPlanDrawer name={DRAWERS.CHANGE_SUBSCARIPTION_PLAN} />
      <InvoiceCustomizeDrawer name={DRAWERS.INVOICE_CUSTOMIZE} />
      <EstimateCustomizeDrawer name={DRAWERS.ESTIMATE_CUSTOMIZE} />
      <ReceiptCustomizeDrawer name={DRAWERS.RECEIPT_CUSTOMIZE} />
      <CreditNoteCustomizeDrawer name={DRAWERS.CREDIT_NOTE_CUSTOMIZE} />
      <PaymentReceivedCustomizeDrawer
        name={DRAWERS.PAYMENT_RECEIVED_CUSTOMIZE}
      />
      <BrandingTemplatesDrawer name={DRAWERS.BRANDING_TEMPLATES} />
      <InvoiceSendMailDrawer name={DRAWERS.INVOICE_SEND_MAIL} />
      <EstimateSendMailDrawer name={DRAWERS.ESTIMATE_SEND_MAIL} />
      <ReceiptSendMailDrawer name={DRAWERS.RECEIPT_SEND_MAIL} />
      <PaymentReceivedSendMailDrawer name={DRAWERS.PAYMENT_RECEIVED_SEND_MAIL} />
    </div>
  );
}
