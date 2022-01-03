import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from 'components';
import { useReceipt } from 'hooks/query';

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

  // Provider.
  const provider = {
    receiptId,
    receipt,
  };

  return (
    <DrawerLoading loading={isReceiptLoading}>
      <DrawerHeaderContent
        name="receipt-detail-drawer"
        title={intl.get('receipt.drawer.title', {
          number: receipt.receipt_number,
        })}
      />
      <ReceiptDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}
const useReceiptDetailDrawerContext = () =>
  React.useContext(ReceiptDetailDrawerContext);

export { ReceiptDetailDrawerProvider, useReceiptDetailDrawerContext };
