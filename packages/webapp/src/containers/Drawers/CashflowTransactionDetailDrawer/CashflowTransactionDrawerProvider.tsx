import React from 'react';
import intl from 'react-intl-universal';
import type { BankingTransactionDetailResponse } from '@bigcapital/sdk-ts';
import { DrawerLoading, DrawerHeaderContent } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useCashflowTransaction } from '@/hooks/query';

export interface CashflowTransactionDrawerContextValue {
  referenceId: number | undefined;
  cashflowTransaction: BankingTransactionDetailResponse | undefined;
  isCashflowTransactionFetching: boolean;
  isCashflowTransactionLoading: boolean;
}

const CashflowTransactionDrawerContext = React.createContext<
  CashflowTransactionDrawerContextValue | undefined
>(undefined);

interface CashflowTransactionDrawerProviderProps {
  referenceId?: number | null;
  children?: React.ReactNode;
}

/**
 * Cashflow transaction drawer provider.
 */
function CashflowTransactionDrawerProvider({
  referenceId,
  ...props
}: CashflowTransactionDrawerProviderProps) {
  // Fetch the specific cashflow transaction details.
  const {
    data: cashflowTransaction,
    isLoading: isCashflowTransactionLoading,
    isFetching: isCashflowTransactionFetching,
  } = useCashflowTransaction(referenceId, {
    enabled: !!referenceId,
  });

  // Provider.
  const provider: CashflowTransactionDrawerContextValue = {
    referenceId: referenceId ?? undefined,
    cashflowTransaction,

    isCashflowTransactionFetching,
    isCashflowTransactionLoading,
  };

  return (
    <DrawerLoading loading={isCashflowTransactionLoading}>
      <DrawerHeaderContent
        name={DRAWERS.CASHFLOW_TRNASACTION_DETAILS}
        title={intl.get('cash_flow.drawer.label_transaction', {
          number: cashflowTransaction?.transactionNumber,
        })}
      />
      <CashflowTransactionDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCashflowTransactionDrawerContext =
  (): CashflowTransactionDrawerContextValue => {
    const ctx = React.useContext(CashflowTransactionDrawerContext);
    if (ctx === undefined) {
      throw new Error(
        'useCashflowTransactionDrawerContext must be used within a CashflowTransactionDrawerProvider',
      );
    }
    return ctx;
  };

export {
  CashflowTransactionDrawerProvider,
  useCashflowTransactionDrawerContext,
};
