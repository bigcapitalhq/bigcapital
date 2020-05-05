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
import { useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import { Link } from 'react-router-dom';
import { compose } from 'utils';
import AccountsConnect from 'connectors/Accounts.connector';
import DashboardConnect from 'connectors/Dashboard.connector';
import {useUpdateEffect} from 'hooks';
import ViewConnect from 'connectors/View.connector';

function AccountsViewsTabs({
  views,
  setTopbarEditView,
  customViewChanged,
  addAccountsTableQueries,
  onViewChanged,
  getViewItem,
  changeCurrentView,
  changePageSubtitle,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    const viewMeta = getViewItem(customViewId);

    changeCurrentView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle((customViewId && viewMeta) ? viewMeta.name : '');
  }, [customViewId]);

  // Clear page subtitle when unmount the page.
  useEffect(() => () => { changePageSubtitle(''); }, []);

  // Handle click a new view tab.
  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/dashboard/custom_views/accounts/new');
  };

  // Handle view tab link click.
  const handleViewLinkClick = () => {
    setTopbarEditView(customViewId);
  };

  useEffect(() => {
    customViewChanged && customViewChanged(customViewId);

    addAccountsTableQueries({
      custom_view_id: customViewId,
    });
  }, [customViewId]);

  useUpdateEffect(() => {
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  const tabs = views.map((view) => {
    const baseUrl = '/dashboard/accounts';

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
            title={<Link to={`/dashboard/accounts`}>All</Link>}
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

export default compose(
  AccountsConnect,
  DashboardConnect,
  ViewConnect,
)(AccountsViewsTabs);
