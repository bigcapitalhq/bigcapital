// @ts-nocheck
import React, { createContext, useContext } from 'react';

import { useAccounts } from '@/hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const GLHeaderGeneralPanelContext = createContext();

/**
 * General ledger provider.
 */
function GLHeaderGeneralPanelProvider({ ...props }) {
  // Accounts list.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Provider
  const provider = {
    accounts,
    isAccountsLoading,
  };

  const loading = isAccountsLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <GLHeaderGeneralPanelContext.Provider value={provider} {...props} />
  );
}

const useGLGeneralPanelContext = () => useContext(GLHeaderGeneralPanelContext);

export { GLHeaderGeneralPanelProvider, useGLGeneralPanelContext };
