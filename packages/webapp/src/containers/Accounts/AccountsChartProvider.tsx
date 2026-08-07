import React, { createContext } from 'react';
import type {
  AccountsList,
  ResourceMetaResponse,
  ResourceViewResponse,
  GetAccountsQuery,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import {
  useResourceViews,
  useResourceMeta,
  useAccounts,
  useSettingsAccounts,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';
import type { SettingsGroup } from '@bigcapital/sdk-ts';

type AccountsChartContextValue = {
  accounts: AccountsList | undefined;
  resourceMeta: ResourceMetaResponse | undefined;
  resourceViews: ResourceViewResponse | undefined;
  fields: any[];
  isAccountsLoading: boolean;
  isAccountsFetching: boolean;
  isResourceMetaFetching: boolean;
  isResourceMetaLoading: boolean;
  isViewsLoading: boolean;
  accountsSettings: SettingsGroup | undefined;
};

const AccountsChartContext = createContext<
  AccountsChartContextValue | undefined
>(undefined);

type AccountsChartProviderProps = {
  query?: GetAccountsQuery;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
};

/**
 * Accounts chart data provider.
 */
function AccountsChartProvider({
  query,
  tableStateChanged,
  ...props
}: AccountsChartProviderProps) {
  // Fetch accounts resource views and fields.
  const { data: resourceViews, isLoading: isViewsLoading } =
    useResourceViews('accounts');

  // Accounts settings.
  const { data: accountsSettings } = useSettingsAccounts();

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
  } = useAccounts(query);

  // Provider payload.
  const provider: AccountsChartContextValue = {
    accounts,

    resourceMeta,
    resourceViews,

    fields: resourceMeta ? getFieldsFromResourceMeta(resourceMeta.fields) : [],

    isAccountsLoading,
    isAccountsFetching,
    isResourceMetaFetching,
    isResourceMetaLoading,
    isViewsLoading,

    accountsSettings,
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

const useAccountsChartContext = (): AccountsChartContextValue => {
  const ctx = React.useContext(AccountsChartContext);
  if (!ctx) {
    throw new Error(
      'useAccountsChartContext must be used within an AccountsChartProvider',
    );
  }
  return ctx;
};

export { AccountsChartProvider, useAccountsChartContext };
