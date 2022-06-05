import React, { createContext, useContext } from 'react';
import { useReceipt } from 'hooks/query';
import { DrawerHeaderContent, DashboardInsider } from 'components';

const ReceiptDrawerContext = createContext();

function ReceiptDrawerProvider({ receiptId, ...props }) {
  // Fetch sale receipt details.
  const {
    data: { entries, ...receipt },
    isFetching: isReceiptLoading,
  } = useReceipt(receiptId, {
    enabled: !!receiptId,
  });
  // Provider payload.
  const provider = {
    receiptId,
    receipt,
    entries,

    isReceiptLoading,
  };

  return (
    <DashboardInsider loading={isReceiptLoading}>
      <DrawerHeaderContent name={'receipt-drawer'} />
      <ReceiptDrawerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}
const useReceiptDrawerContext = () => useContext(ReceiptDrawerContext);

export { ReceiptDrawerProvider, useReceiptDrawerContext };
