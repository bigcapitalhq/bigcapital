import React from 'react';
import EstimateDrawer from 'containers/Sales/Estimates/EstimateDetails/EstimateDrawer';
import InvoiceDrawer from 'containers/Sales/Invoices/InvoiceDetails/InvoiceDrawer';
import ReceiptDrawer from 'containers/Sales/Receipts/ReceiptDetails/ReceiptDrawer';
import PaymentReceiveDrawer from 'containers/Sales/PaymentReceives/PaymentDetails/PaymentReceiveDrawer';
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
import ContactDetailDrawer from '../containers/Drawers/ContactDetailDrawer';

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
      <BillDrawer name={'bill-drawer'} />
      <InvoiceDetailDrawer name={'invoice-detail-drawer'} />
      <EstimateDetailDrawer name={'estimate-detail-drawer'} />
      <ReceiptDetailDrawer name={'receipt-detail-drawer'} />
      <PaymentReceiveDetailDrawer name={'payment-receive-detail-drawer'} />
      <PaymentMadeDetailDrawer name={'payment-made-detail-drawer'} />
      <ItemDetailDrawer name={'item-detail-drawer'} />
      <ContactDetailDrawer name={'contact-detail-drawer'} />
    </div>
  );
}
