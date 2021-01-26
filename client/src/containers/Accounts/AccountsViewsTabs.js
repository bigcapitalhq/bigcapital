import React, { useEffect, useMemo, memo, useCallback } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccounts from 'containers/Accounts/withAccounts';
import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';
import withViewDetail from 'containers/Views/withViewDetails';

import { compose } from 'utils';

/**
 * Accounts views tabs.
 */
function AccountsViewsTabs({
  // #withViewDetail
  viewId,
  viewItem,

  // #withAccounts
  accountsViews,

  // #withAccountsTableActions
  changeAccountsCurrentView,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');
  }, [customViewId, viewItem, changePageSubtitle, setTopbarEditView]);

  // Handle click a new view tab.
  const handleClickNewView = useCallback(() => {
    setTopbarEditView(null);
    history.push('/custom_views/accounts/new');
  }, [setTopbarEditView]);

  const handleTabChange = useCallback((viewId) => {
    changeAccountsCurrentView(viewId || -1);
  }, [changeAccountsCurrentView]);

  const tabs = useMemo(() => accountsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  })), [accountsViews]);;

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

const AccountsViewsTabsMemo = memo(AccountsViewsTabs);

const mapStateToProps = (state, ownProps) => ({
  viewId: -1,
});

const withAccountsViewsTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withAccountsViewsTabs,
  withDashboardActions,
  withAccounts(({ accountsViews }) => ({
    accountsViews,
  })),
  withAccountsTableActions,
  withViewDetail(),
)(AccountsViewsTabsMemo);
