import React from 'react';
import intl from 'react-intl-universal';
import type { RefundVendorCreditTransaction } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useRefundVendorCreditTransaction } from '@/hooks/query';

export interface RefundVendorCreditDrawerContextValue {
  refundTransactionId: number | undefined;
  refundVendorTransaction: RefundVendorCreditTransaction | undefined;
}

const RefundVendorCreditDrawerContext = React.createContext<
  RefundVendorCreditDrawerContextValue | undefined
>(undefined);

interface RefundVendorCreditDrawerProviderProps {
  refundTransactionId?: number | null;
  children?: React.ReactNode;
}

/**
 * Refund vendor credit drawer provider.
 */
function RefundVendorCreditDrawerProvider({
  refundTransactionId,
  ...props
}: RefundVendorCreditDrawerProviderProps) {
  // Handle fetch refund vendor credit transaction.
  const {
    data: refundVendorTransaction,
    isLoading: isRefundVendorTransaction,
  } = useRefundVendorCreditTransaction(refundTransactionId, {
    enabled: !!refundTransactionId,
  });

  // provider
  const provider: RefundVendorCreditDrawerContextValue = {
    refundTransactionId: refundTransactionId ?? undefined,
    refundVendorTransaction,
  };

  return (
    <DrawerLoading loading={isRefundVendorTransaction}>
      <DrawerHeaderContent
        name={DRAWERS.REFUND_VENDOR_CREDIT_DETAILS}
        title={intl.get('refund_vendor_credit.drawer.title')}
      />
      <RefundVendorCreditDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useRefundVendorCreditNoteDrawerContext =
  (): RefundVendorCreditDrawerContextValue => {
    const ctx = React.useContext(RefundVendorCreditDrawerContext);
    if (ctx === undefined) {
      throw new Error(
        'useRefundVendorCreditNoteDrawerContext must be used within a RefundVendorCreditDrawerProvider',
      );
    }
    return ctx;
  };

export {
  RefundVendorCreditDrawerProvider,
  useRefundVendorCreditNoteDrawerContext,
};
