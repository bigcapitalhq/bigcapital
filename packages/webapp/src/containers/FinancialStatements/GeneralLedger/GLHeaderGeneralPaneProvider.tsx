import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';
import { useAccounts } from '@/hooks/query';

type GLHeaderGeneralPanelContextValue = {
  accounts: ReturnType<typeof useAccounts>['data'];
  isAccountsLoading: boolean;
};

const GLHeaderGeneralPanelContext = createContext<
  GLHeaderGeneralPanelContextValue | undefined
>(undefined);

/**
 * General ledger header general panel provider.
 */
function GLHeaderGeneralPanelProvider({
  ...props
}: {
  children?: React.ReactNode;
}) {
  // Accounts list.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Provider
  const provider: GLHeaderGeneralPanelContextValue = {
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

const useGLGeneralPanelContext = (): GLHeaderGeneralPanelContextValue => {
  const ctx = useContext(GLHeaderGeneralPanelContext);
  if (!ctx) {
    throw new Error(
      'useGLGeneralPanelContext must be used within a GLHeaderGeneralPanelProvider',
    );
  }
  return ctx;
};

export { GLHeaderGeneralPanelProvider, useGLGeneralPanelContext };
