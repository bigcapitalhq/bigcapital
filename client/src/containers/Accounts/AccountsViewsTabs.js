import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { pick } from 'lodash';

import { useUpdateEffect } from 'hooks';
import { DashboardViewsTabs } from 'components';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withAccounts from 'containers/Accounts/withAccounts';
import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';
import withViewDetail from 'containers/Views/withViewDetails';

import { compose } from 'utils';

function AccountsViewsTabs({
  // #withViewDetail
  viewId,
  viewItem,

  // #withAccounts
  accountsViews,

  // #withAccountsTableActions
  addAccountsTableQueries,
  changeAccountsCurrentView,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,

  // props
  customViewChanged,
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');
  }, [customViewId]);

  // Handle click a new view tab.
  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/accounts/new');
  };

  const handleTabChange = (viewId) => {
    changeAccountsCurrentView(viewId || -1);
    // addAccountsTableQueries({
    //   custom_view_id: viewId || null,
    // });
  };

  const tabs = accountsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));
  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'accounts'}
          onChange={handleTabChange}
          tabs={tabs}
        />
      </NavbarGroup>
    </Navbar>
  );
}

const mapStateToProps = (state, ownProps) => ({
  viewId: ownProps.match.params.custom_view_id,
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
)(AccountsViewsTabs);
