import React from 'react';
import InvoicePaymentTransactionsTable from './InvoicePaymentTransactionsDataTable';
import EstimatePaymentTransactionsTable from './EstimatePaymentTransactionsDataTable';
import ReceiptPaymentTransactionsTable from './ReceiptPaymentTransactionsDataTable';
import BillPaymentTransactionsTable from './BillPaymentTransactionsDataTable';

export default function ItemPaymentTransactionsContent({ tansactionType }) {
  const handleType = () => {
    switch (tansactionType) {
      case 'invoices':
        return <InvoicePaymentTransactionsTable />;
      case 'estimates':
        return <EstimatePaymentTransactionsTable />;
      case 'receipts':
        return <ReceiptPaymentTransactionsTable />;
      case 'bills':
        return <BillPaymentTransactionsTable />;
    }
  };
  return handleType();
}
