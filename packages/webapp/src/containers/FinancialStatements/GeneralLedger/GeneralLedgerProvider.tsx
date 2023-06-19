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
  // Transforms the report query to request query.
  const requestQuery = React.useMemo(
    () => transformFilterFormToQuery(query),
    [query],
  );

  const {
    data: generalLedger,
    isFetching,
    isLoading,
    refetch,
  } = useGeneralLedgerSheet(requestQuery, { keepPreviousData: true });

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
