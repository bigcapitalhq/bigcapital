// @ts-nocheck
import React, { useCallback } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import { DashboardViewsTabs } from '@/components';
import { useAccountsChartContext } from './AccountsChartProvider';

import withAccounts from './withAccounts';
import withAccountsTableActions from './withAccountsTableActions';

import { compose, transformViewsToTabs } from '@/utils';

/**
 * Accounts views tabs.
 */
function AccountsViewsTabs({
  // #withAccountsTableActions
  setAccountsTableState,

  // #withAccounts
  accountsCurrentView
}) {
  // Accounts chart context.
  const { resourceViews } = useAccountsChartContext();

  // Handles the tab change.
  const handleTabChange = useCallback(
    (viewSlug) => {
      setAccountsTableState({
        viewSlug: viewSlug || null,
      });
    },
    [setAccountsTableState],
  );

  // Transforms the accounts views to tabs.
  const tabs = transformViewsToTabs(resourceViews);

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

export default compose(
  withAccountsTableActions,
  withAccounts(({ accountsTableState }) => ({
    accountsCurrentView: accountsTableState.viewSlug
  }))
)(AccountsViewsTabs);
