import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from 'components';
import { useTransactionsByReference, useReceipt } from 'hooks/query';

// useTransactionsByReference
const ReceiptDetailDrawerContext = React.createContext();

/**
 * Receipt detail provider.
 */
function ReceiptDetailDrawerProvider({ receiptId, ...props }) {
  // Fetch sale receipt details.
  const { data: receipt, isFetching: isReceiptLoading } = useReceipt(
    receiptId,
    {
      enabled: !!receiptId,
    },
  );

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

  // Provider.
  const provider = {
    transactions,
    receiptId,
    receipt,
  };

  const loading = isTransactionLoading || isReceiptLoading;

  return (
    <DrawerLoading loading={loading}>
      <DrawerHeaderContent
        name="receipt-detail-drawer"
        title={intl.get('receipt_details')}
      />
      <ReceiptDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}
const useReceiptDetailDrawerContext = () =>
  React.useContext(ReceiptDetailDrawerContext);

export { ReceiptDetailDrawerProvider, useReceiptDetailDrawerContext };
