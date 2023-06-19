// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useCashflowTransaction } from '@/hooks/query';

import { DrawerLoading, DrawerHeaderContent } from '@/components';
import { DRAWERS } from '@/constants/drawers';

const CashflowTransactionDrawerContext = React.createContext();

/**
 * Cashflow transaction drawer provider.
 */
function CashflowTransactionDrawerProvider({ referenceId, ...props }) {
  // Fetch the specific cashflow transaction details.
  const {
    data: cashflowTransaction,
    isLoading: isCashflowTransactionLoading,
    isFetching: isCashflowTransactionFetching,
  } = useCashflowTransaction(referenceId, {
    enabled: !!referenceId,
  });

  // Provider.
  const provider = {
    referenceId,
    cashflowTransaction,

    isCashflowTransactionFetching,
    isCashflowTransactionLoading,
  };

  return (
    <DrawerLoading loading={isCashflowTransactionLoading}>
      <DrawerHeaderContent
        name={DRAWERS.CASHFLOW_TRANSACTION_DETAILS}
        title={intl.get('cash_flow.drawer.label_transaction', {
          number: cashflowTransaction?.transaction_number,
        })}
      />
      <CashflowTransactionDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useCashflowTransactionDrawerContext = () =>
  React.useContext(CashflowTransactionDrawerContext);

export {
  CashflowTransactionDrawerProvider,
  useCashflowTransactionDrawerContext,
};
