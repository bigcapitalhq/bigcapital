// @ts-nocheck
import React, { createContext, useContext } from 'react';

import FinancialReportPage from '../FinancialReportPage';
import { useGeneralLedgerSheet } from '@/hooks/query';
import { transformFilterFormToQuery } from '../common';

const GeneralLedgerContext = createContext();

/**
 * General ledger provider.
 */
function GeneralLedgerProvider({ query, ...props }) {
  // Transformes the report query to request query.
  const httpQuery = React.useMemo(
    () => transformFilterFormToQuery(query),
    [query],
  );
  const {
    data: generalLedger,
    isFetching,
    isLoading,
    refetch,
  } = useGeneralLedgerSheet(httpQuery, { keepPreviousData: true });

  const provider = {
    generalLedger,
    sheetRefresh: refetch,
    isFetching,
    isLoading,
    httpQuery,
  };
  return (
    <FinancialReportPage name={'general-ledger-sheet'}>
      <GeneralLedgerContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useGeneralLedgerContext = () => useContext(GeneralLedgerContext);

export { GeneralLedgerProvider, useGeneralLedgerContext };
