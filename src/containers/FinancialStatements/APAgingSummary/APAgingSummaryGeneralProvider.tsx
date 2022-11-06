// @ts-nocheck
import React, { createContext, useContext } from 'react';

import { useVendors } from '@/hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const APAgingSummaryGeneralContext = createContext();

/**
 * A/P aging summary provider.
 */
function APAgingSummaryGeneralProvider({ filter, ...props }) {
  // Retrieve the vendors list.
  const {
    data: { vendors },
    isFetching: isVendorsLoading,
  } = useVendors();

  const provider = {
    vendors,
    isVendorsLoading,
  };
  // Loading state.
  const loading = isVendorsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <APAgingSummaryGeneralContext.Provider value={provider} {...props} />
  );
}

const useAPAgingSummaryGeneralContext = () =>
  useContext(APAgingSummaryGeneralContext);

export { APAgingSummaryGeneralProvider, useAPAgingSummaryGeneralContext };
