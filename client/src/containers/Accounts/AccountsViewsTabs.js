import React, {useEffect, useCallback} from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import {
  Alignment,
  Navbar,
  NavbarGroup,
  Tabs,
  Tab,
  Button
} from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import Icon from 'components/Icon';
import { Link } from 'react-router-dom';
import { compose } from 'utils';
import {useUpdateEffect} from 'hooks';

import withDashboard from 'containers/Dashboard/withDashboard';
import withAccounts from 'containers/Accounts/withAccounts';
import withAccountsTableActions from 'containers/Accounts/withAccountsTableActions';
import withViewDetail from 'containers/Views/withViewDetails';
import { FormattedMessage as T, useIntl } from 'react-intl';

function AccountsViewsTabs({
  // #withViewDetail
  viewId,
  viewItem,

  // #withAccounts
  accountsViews,

  // #withAccountsTableActions
  addAccountsTableQueries,
  changeAccountsCurrentView,

  // #withDashboard
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
    changePageSubtitle((customViewId && viewItem) ? viewItem.name : '');

    addAccountsTableQueries({
      custom_view_id: customViewId,
    });

    return () => {
      setTopbarEditView(null);
      changePageSubtitle('');
      changeAccountsCurrentView(null)
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

  // Handle view tab link click.
  const handleViewLinkClick = () => {
    setTopbarEditView(customViewId);
  };

  const tabs = accountsViews.map((view) => {
    const baseUrl = '/accounts';

    const link = (
      <Link
        to={`${baseUrl}/${view.id}/custom_view`}
        onClick={handleViewLinkClick}
      >{ view.name }</Link>
    );
    return <Tab id={`custom_view_${view.id}`} title={link} />;
  });

  return (
    <Navbar className='navbar--dashboard-views'>
      <NavbarGroup align={Alignment.LEFT}>
        <Tabs
          id='navbar'
          large={true}
          selectedTabId={customViewId ? `custom_view_${customViewId}` : 'all'}
          className='tabs--dashboard-views'
        >
          <Tab
            id={'all'}
            title={<Link to={`/accounts`}><T id={'all'}/></Link>}
            onClick={handleViewLinkClick}
          />
          { tabs }
          <Button
            className='button--new-view'
            icon={<Icon icon='plus' />}
            onClick={handleClickNewView}
            minimal={true}
          />
        </Tabs>
      </NavbarGroup>
    </Navbar>
  );
}

const mapStateToProps = (state, ownProps) => ({
  // Mapping view id from matched route params.
  viewId: ownProps.match.params.custom_view_id,
});

const withAccountsViewsTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withAccountsViewsTabs,
  withDashboard,
  withAccounts(({ accountsViews }) => ({
    accountsViews,
  })),
  withAccountsTableActions,
  withViewDetail
)(AccountsViewsTabs);
