import React, { createContext } from 'react';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import { useResourceViews, useResourceFields, useAccounts } from 'hooks/query';

const AccountsChartContext = createContext();

/**
 * Accounts chart data provider.
 */
function AccountsChartProvider({ query, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: resourceViews, isLoading: isViewsLoading } = useResourceViews(
    'accounts',
  );

  // Fetch the accounts resource fields.
  const {
    data: resourceFields,
    isLoading: isFieldsLoading,
  } = useResourceFields('accounts');

  // Fetch accounts list according to the given custom view id.
  const {
    data: accounts,
    isFetching: isAccountsFetching,
    isLoading: isAccountsLoading
  } = useAccounts(
    query,
    { keepPreviousData: true }
  );

  // Provider payload.
  const provider = {
    accounts,
    resourceFields,
    resourceViews,

    isAccountsLoading,
    isAccountsFetching,
    isFieldsLoading,
    isViewsLoading,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isFieldsLoading}
      name={'accounts-chart'}
    >
      <AccountsChartContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useAccountsChartContext = () => React.useContext(AccountsChartContext);

export { AccountsChartProvider, useAccountsChartContext };
