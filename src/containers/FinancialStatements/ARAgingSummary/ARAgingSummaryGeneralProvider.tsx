// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { useCustomers } from '@/hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const ARAgingSummaryGeneralContext = createContext();

/**
 * A/R aging summary general tab provider.
 */
function ARAgingSummaryGeneralProvider({ ...props }) {
  // Retrieve the customers list.
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers();

  const provider = {
    customers,
    isCustomersLoading,
  };
  // Loading state.
  const loading = isCustomersLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <ARAgingSummaryGeneralContext.Provider value={provider} {...props} />
  );
}

const useARAgingSummaryGeneralContext = () =>
  useContext(ARAgingSummaryGeneralContext);

export { ARAgingSummaryGeneralProvider, useARAgingSummaryGeneralContext };
