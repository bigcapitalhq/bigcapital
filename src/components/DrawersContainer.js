import React from 'react';

import AccountDrawer from 'containers/Drawers/AccountDrawer';
import ManualJournalDrawer from 'containers/Drawers/ManualJournalDrawer';
import ExpenseDrawer from 'containers/Drawers/ExpenseDrawer';
import BillDrawer from 'containers/Drawers/BillDrawer';
import InvoiceDetailDrawer from 'containers/Drawers/InvoiceDetailDrawer';
import ReceiptDetailDrawer from 'containers/Drawers/ReceiptDetailDrawer';
import PaymentReceiveDetailDrawer from 'containers/Drawers/PaymentReceiveDetailDrawer';
import PaymentMadeDetailDrawer from 'containers/Drawers/PaymentMadeDetailDrawer';
import EstimateDetailDrawer from '../containers/Drawers/EstimateDetailDrawer';
import ItemDetailDrawer from '../containers/Drawers/ItemDetailDrawer';
import CustomerDetailsDrawer from '../containers/Drawers/CustomerDetailsDrawer';
import VendorDetailsDrawer from '../containers/Drawers/VendorDetailsDrawer';
import InventoryAdjustmentDetailDrawer from '../containers/Drawers/InventoryAdjustmentDetailDrawer';
import CashflowTransactionDetailDrawer from '../containers/Drawers/CashflowTransactionDetailDrawer';
import QuickCreateCustomerDrawer from '../containers/Drawers/QuickCreateCustomerDrawer';
import QuickCreateItemDrawer from '../containers/Drawers/QuickCreateItemDrawer';
import QuickWriteVendorDrawer from '../containers/Drawers/QuickWriteVendorDrawer';

import { DRAWERS } from 'common/drawers';

/**
 * Drawers container of the dashboard.
 */
export default function DrawersContainer() {
  return (
    <div>
      <AccountDrawer name={DRAWERS.ACCOUNT_DRAWER} />
      <ManualJournalDrawer name={DRAWERS.JOURNAL_DRAWER} />
      <ExpenseDrawer name={DRAWERS.EXPENSE_DRAWER} />
      <BillDrawer name={DRAWERS.BILL_DRAWER} />
      <InvoiceDetailDrawer name={'invoice-detail-drawer'} />
      <EstimateDetailDrawer name={'estimate-detail-drawer'} />
      <ReceiptDetailDrawer name={'receipt-detail-drawer'} />
      <PaymentReceiveDetailDrawer name={'payment-receive-detail-drawer'} />
      <PaymentMadeDetailDrawer name={'payment-made-detail-drawer'} />
      <ItemDetailDrawer name={'item-detail-drawer'} />
      <CustomerDetailsDrawer name={'customer-details-drawer'} />
      <VendorDetailsDrawer name={'vendor-details-drawer'} />
      <InventoryAdjustmentDetailDrawer
        name={DRAWERS.INVENTORY_ADJUSTMENT_DRAWER}
      />
      <CashflowTransactionDetailDrawer
        name={DRAWERS.CASHFLOW_TRNASACTION_DRAWER}
      />
      <QuickCreateCustomerDrawer name={DRAWERS.QUICK_CREATE_CUSTOMER} />
      <QuickCreateItemDrawer name={DRAWERS.QUICK_CREATE_ITEM} />
      <QuickWriteVendorDrawer name={DRAWERS.QUICK_WRITE_VENDOR} />
    </div>
  );
}
