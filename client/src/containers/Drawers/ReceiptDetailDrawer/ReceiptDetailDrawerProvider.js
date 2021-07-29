import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DashboardInsider } from 'components';

const ReceiptDetailDrawerContext = React.createContext();

/**
 * Receipt detail provider.
 */
function ReceiptDetailDrawerProvider({ receiptId, ...props }) {
  //provider.
  const provider = {};

  return (
    <DashboardInsider>
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
