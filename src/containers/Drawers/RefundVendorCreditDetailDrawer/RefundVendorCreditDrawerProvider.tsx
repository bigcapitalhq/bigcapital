import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from 'components';
import { useRefundVendorCreditTransaction } from 'hooks/query';

const RefundVendorCreditDrawerContent = React.createContext();

/**
 * Refund vendor credit drawer provider.
 */
function RefundVendorCreditDrawerProvider({ refundTransactionId, ...props }) {
  // Handle fetch refund credit note transaction.
  const {
    data: refundVendorTransaction,
    isLoading: isRefundVendorTransaction,
  } = useRefundVendorCreditTransaction(refundTransactionId, {
    enabled: !!refundTransactionId,
  });

  // provider
  const provider = {
    refundTransactionId,
    refundVendorTransaction,
  };

  return (
    <DrawerLoading loading={isRefundVendorTransaction}>
      <DrawerHeaderContent
        name="refund-vendor-detail-drawer"
        title={intl.get('refund_vendor_credit.drawer.title')}
      />
      <RefundVendorCreditDrawerContent.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useRefundVendorCreditNoteDrawerContext = () =>
  React.useContext(RefundVendorCreditDrawerContent);

export {
  RefundVendorCreditDrawerProvider,
  useRefundVendorCreditNoteDrawerContext,
};
