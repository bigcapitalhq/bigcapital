// @ts-nocheck
import React, { createContext } from 'react';
import { DashboardInsider } from '@/components';
import { useResourceViews, useResourceMeta, useAccounts } from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';

const AccountsChartContext = createContext();

/**
 * Accounts chart data provider.
 */
function AccountsChartProvider({ query, tableStateChanged, ...props }) {
  // Fetch accounts resource views and fields.
  const { data: resourceViews, isLoading: isViewsLoading } =
    useResourceViews('accounts');

  // Fetch the accounts resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceMetaLoading,
    isFetching: isResourceMetaFetching,
  } = useResourceMeta('accounts');

  // Fetch accounts list according to the given custom view id.
  const {
    data: accounts,
    isFetching: isAccountsFetching,
    isLoading: isAccountsLoading,
  } = useAccounts(query, { keepPreviousData: true });

  // Provider payload.
  const provider = {
    accounts,

    resourceMeta,
    resourceViews,

    fields: getFieldsFromResourceMeta(resourceMeta.fields),

    isAccountsLoading,
    isAccountsFetching,
    isResourceMetaFetching,
    isResourceMetaLoading,
    isViewsLoading,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceMetaLoading}
      name={'accounts-chart'}
    >
      <AccountsChartContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useAccountsChartContext = () => React.useContext(AccountsChartContext);

export { AccountsChartProvider, useAccountsChartContext };
