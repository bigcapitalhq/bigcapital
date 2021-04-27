import React from 'react';
import EstimateDrawer from 'containers/Sales/Estimates/EstimateDetails/EstimateDrawer';
import InvoiceDrawer from 'containers/Sales/Invoices/InvoiceDetails/InvoiceDrawer';
import ReceiptDrawer from 'containers/Sales/Receipts/ReceiptDetails/ReceiptDrawer';
import PaymentReceiveDrawer from 'containers/Sales/PaymentReceives/PaymentDetails/PaymentReceiveDrawer';
import AccountDrawer from 'containers/Drawers/AccountDrawer';
import ManualJournalDrawer from 'containers/Drawers/ManualJournalDrawer';
import ExpenseDrawer from 'containers/Drawers/ExpenseDrawer';

export default function DrawersContainer() {
  return (
    <div>
      <EstimateDrawer name={'estimate-drawer'} />
      <InvoiceDrawer name={'invoice-drawer'} />
      <ReceiptDrawer name={'receipt-drawer'} />
      <PaymentReceiveDrawer name={'payment-receive-drawer'} />
      <AccountDrawer name={'account-drawer'} />
      <ManualJournalDrawer name={'journal-drawer'} />
      <ExpenseDrawer name={'expense-drawer'} />
    </div>
  );
}
