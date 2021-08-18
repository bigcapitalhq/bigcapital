import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';
import { useTransactionsByReference } from 'hooks/query';

// useTransactionsByReference
const ReceiptDetailDrawerContext = React.createContext();

/**
 * Receipt detail provider.
 */
function ReceiptDetailDrawerProvider({ receiptId, ...props }) {
  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: receiptId,
      reference_type: 'SaleReceipt',
    },
    { enabled: !!receiptId },
  );

  //provider.
  const provider = {
    transactions,
    receiptId,
  };

  return (
    <DashboardInsider loading={isTransactionLoading}>
      <DrawerHeaderContent
        name="receipt-detail-drawer"
        title={intl.get('receipt_details')}
      />
      <ReceiptDetailDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}
const useReceiptDetailDrawerContext = () =>
  React.useContext(ReceiptDetailDrawerContext);

export { ReceiptDetailDrawerProvider, useReceiptDetailDrawerContext };
