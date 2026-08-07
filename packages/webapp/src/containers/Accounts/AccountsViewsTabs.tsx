import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { useAccountsChartContext } from './AccountsChartProvider';
import { withAccounts } from './withAccounts';
import { withAccountsTableActions } from './withAccountsTableActions';
import type { WithAccountsProps } from './withAccounts';
import type { WithAccountsTableActionsProps } from './withAccountsTableActions';
import { DashboardViewsTabs } from '@/components';
import { compose, transfromViewsToTabs } from '@/utils';

interface AccountsViewsTabsInnerProps extends WithAccountsTableActionsProps {
  accountsCurrentView: WithAccountsProps['accountsTableState']['viewSlug'];
}

/**
 * Accounts views tabs.
 */
function AccountsViewsTabsInner({
  // #withAccountsTableActions
  setAccountsTableState,

  // #withAccounts
  accountsCurrentView,
}: AccountsViewsTabsInnerProps) {
  // Accounts chart context.
  const { resourceViews } = useAccountsChartContext();

  // Handles the tab change.
  const handleTabChange = useCallback(
    (viewSlug: string) => {
      setAccountsTableState({
        viewSlug: viewSlug || (null as unknown as string),
      });
    },
    [setAccountsTableState],
  );

  // Transfromes the accounts views to tabs.
  // `transfromViewsToTabs` is untyped; surface as `unknown[]` to keep the
  // DashboardViewsTabs consumer happy.
  const tabs = transfromViewsToTabs(resourceViews) as unknown[];

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          defaultTabText={intl.get('all_accounts_')}
          currentViewSlug={accountsCurrentView}
          resourceName={'accounts'}
          onChange={handleTabChange}
          tabs={tabs}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const AccountsViewsTabs = compose(
  withAccountsTableActions,
  withAccounts(({ accountsTableState }) => ({
    accountsCurrentView: accountsTableState.viewSlug,
  })),
)(AccountsViewsTabsInner);
