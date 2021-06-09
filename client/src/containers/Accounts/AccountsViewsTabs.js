import React, { useMemo, useCallback } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { pick } from 'lodash';
import { formatMessage } from 'services/intl';


import { DashboardViewsTabs } from 'components';
import { useAccountsChartContext } from 'containers/Accounts/AccountsChartProvider';

import withAccountsTableActions from './withAccountsTableActions';
import withAccounts from './withAccounts';

import { compose } from 'utils';

/**
 * Accounts views tabs.
 */
function AccountsViewsTabs({
  // #withAccountsTableActions
  setAccountsTableState,

  // #withAccounts
  accountsCustomViewId
}) {
  // Accounts chart context.
  const { resourceViews } = useAccountsChartContext();

  // Handles the tab change.
  const handleTabChange = useCallback(
    (viewId) => {
      setAccountsTableState({
        customViewId: viewId || null,
      });
    },
    [setAccountsTableState],
  );

  const tabs = useMemo(
    () =>
      resourceViews.map((view) => ({
        ...pick(view, ['name', 'id']),
      })),
    [resourceViews],
  );

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          defaultTabText={formatMessage({id:'all_accounts_'})}
          currentViewId={accountsCustomViewId}
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
    accountsCustomViewId: accountsTableState.customViewId
  }))
)(AccountsViewsTabs);
