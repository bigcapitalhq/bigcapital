import React, { createContext, useContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useGeneralLedgerSheet, useAccounts } from 'hooks/query';

const GeneralLedgerContext = createContext();

/**
 * General ledger provider.
 */
function GeneralLedgerProvider({ query, ...props }) {
  const { data: generalLedger, isFetching, refetch } = useGeneralLedgerSheet(query);

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
