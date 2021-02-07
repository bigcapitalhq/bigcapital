import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useGeneralLedgerSheet, useAccounts } from 'hooks/query';
import { transformFilterFormToQuery } from '../common';

const GeneralLedgerContext = createContext();

function GeneralLedgerProvider({ query, ...props }) {
  const { data: generalLedger, isFetching, refetch } = useGeneralLedgerSheet({
    ...transformFilterFormToQuery(query),
  });

  // Accounts list.
  const { data: accounts, isFetching: isAccountsLoading } = useAccounts();

  const provider = {
    generalLedger,
    accounts,
    sheetRefresh: refetch,
    isSheetLoading: isFetching,
    isAccountsLoading,
  };
  return (
    <DashboardInsider name={'general-ledger-sheet'}>
      <GeneralLedgerContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useGeneralLedgerContext = () => useContext(GeneralLedgerContext);

export { GeneralLedgerProvider, useGeneralLedgerContext };
