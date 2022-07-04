import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { useRefundCreditTransaction } from 'hooks/query';

const RefundCreditNoteDrawerContext = React.createContext();

/**
 * Refund credit note drawer provider.
 */
function RefundCreditNoteDrawerProvider({ refundTransactionId, ...props }) {
  // Handle fetch refund credit note transaction.
  const {
    data: refundCreditTransaction,
    isLoading: isRefundCreditTransaction,
  } = useRefundCreditTransaction(refundTransactionId, {
    enabled: !!refundTransactionId,
  });

  // provider
  const provider = {
    refundTransactionId,
    refundCreditTransaction,
  };

  return (
    <DrawerLoading loading={isRefundCreditTransaction}>
      <DrawerHeaderContent
        name="refund-credit-detail-drawer"
        title={intl.get('refund_credit.drawer.title')}
      />
      <RefundCreditNoteDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useRefundCreditNoteDrawerContext = () =>
  React.useContext(RefundCreditNoteDrawerContext);

export { RefundCreditNoteDrawerProvider, useRefundCreditNoteDrawerContext };
