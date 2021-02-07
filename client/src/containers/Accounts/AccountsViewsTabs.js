import React, { useMemo, useCallback } from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams  } from 'react-router-dom';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';
import { useAccountsChartContext } from 'containers/Accounts/AccountsChartProvider';

import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';

import { compose } from 'utils';

/**
 * Accounts views tabs.
 */
function AccountsViewsTabs({
  // #withAccountsTableActions
  addAccountsTableQuery,
}) {
  const { resourceViews } = useAccountsChartContext();
  const { custom_view_id: customViewId = null } = useParams();

  const handleTabChange = useCallback(
    (viewId) => {
      addAccountsTableQuery({
        custom_view_id: viewId || null,
      });
    },
    [addAccountsTableQuery],
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
          defaultTabText={'All Accounts'}
          initialViewId={customViewId}
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
)(AccountsViewsTabs);
