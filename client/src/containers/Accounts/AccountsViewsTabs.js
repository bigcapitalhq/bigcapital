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
    changeAccountsCurrentView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');

    addAccountsTableQueries({
      custom_view_id: customViewId,
    });

    return () => {
      setTopbarEditView(null);
      changePageSubtitle('');
      changeAccountsCurrentView(null);
    };
  }, [customViewId]);

  useUpdateEffect(() => {
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  // Handle click a new view tab.
  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/accounts/new');
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
