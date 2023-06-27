// @ts-nocheck
import React from 'react';
import InvoicePaymentTransactions from './InvoicePaymentTransactions';
import EstimatePaymentTransactions from './EstimatePaymentTransactions';
import ReceiptPaymentTransactions from './ReceiptPaymentTransactions';
import BillPaymentTransactions from './BillPaymentTransactions';

export default function ItemPaymentTransactionsContent({ transactionType }) {
  const handleType = () => {
    switch (transactionType) {
      case 'invoices':
      default:
        return <InvoicePaymentTransactions />;
      case 'estimates':
        return <EstimatePaymentTransactions />;
      case 'receipts':
        return <ReceiptPaymentTransactions />;
      case 'bills':
        return <BillPaymentTransactions />;
    }
  };
  return handleType();
}
