import React from 'react';
import { index as BillPaymentTransactions } from './BillPaymentTransactions';
import { index as EstimatePaymentTransactions } from './EstimatePaymentTransactions';
import { index as InvoicePaymentTransactions } from './InvoicePaymentTransactions';
import { index as ReceiptPaymentTransactions } from './ReceiptPaymentTransactions';

interface ItemPaymentTransactionsContentProps {
  transactionType: string;
}

export function ItemPaymentTransactionsContent({
  transactionType,
}: ItemPaymentTransactionsContentProps) {
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
