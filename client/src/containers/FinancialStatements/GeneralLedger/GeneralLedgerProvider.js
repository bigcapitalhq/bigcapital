import React, { createContext, useContext } from 'react';
import FinancialReportPage from '../FinancialReportPage';
import { useGeneralLedgerSheet, useAccounts } from 'hooks/query';

const GeneralLedgerContext = createContext();

/**
 * General ledger provider.
 */
function GeneralLedgerProvider({ query, ...props }) {
  const {
    data: generalLedger,
    isFetching,
    isLoading,
    refetch,
  } = useGeneralLedgerSheet(query, { keepPreviousData: true });

  const provider = {
    generalLedger,
    sheetRefresh: refetch,
    isFetching,
    isLoading,
  };
  return (
    <FinancialReportPage name={'general-ledger-sheet'}>
      <GeneralLedgerContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useGeneralLedgerContext = () => useContext(GeneralLedgerContext);

export { GeneralLedgerProvider, useGeneralLedgerContext };
