import React from 'react';
import intl from 'react-intl-universal';
import type { RefundCreditNoteTransaction } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useRefundCreditTransaction } from '@/hooks/query';

export interface RefundCreditNoteDrawerContextValue {
  refundTransactionId: number | undefined;
  refundCreditTransaction: RefundCreditNoteTransaction | undefined;
}

const RefundCreditNoteDrawerContext = React.createContext<
  RefundCreditNoteDrawerContextValue | undefined
>(undefined);

interface RefundCreditNoteDrawerProviderProps {
  refundTransactionId?: number | null;
  children?: React.ReactNode;
}

/**
 * Refund credit note drawer provider.
 */
function RefundCreditNoteDrawerProvider({
  refundTransactionId,
  ...props
}: RefundCreditNoteDrawerProviderProps) {
  // Handle fetch refund credit note transaction.
  const {
    data: refundCreditTransaction,
    isLoading: isRefundCreditTransaction,
  } = useRefundCreditTransaction(refundTransactionId, {
    enabled: !!refundTransactionId,
  });

  // provider
  const provider: RefundCreditNoteDrawerContextValue = {
    refundTransactionId: refundTransactionId ?? undefined,
    refundCreditTransaction,
  };

  return (
    <DrawerLoading loading={isRefundCreditTransaction}>
      <DrawerHeaderContent
        name={DRAWERS.REFUND_CREDIT_NOTE_DETAILS}
        title={intl.get('refund_credit.drawer.title')}
      />
      <RefundCreditNoteDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useRefundCreditNoteDrawerContext =
  (): RefundCreditNoteDrawerContextValue => {
    const ctx = React.useContext(RefundCreditNoteDrawerContext);
    if (ctx === undefined) {
      throw new Error(
        'useRefundCreditNoteDrawerContext must be used within a RefundCreditNoteDrawerProvider',
      );
    }
    return ctx;
  };

export { RefundCreditNoteDrawerProvider, useRefundCreditNoteDrawerContext };
