import React from 'react';
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

function AccountsViewsTabs({ views }) {
  const history = useHistory();
  const { custom_view_id: customViewId } = useParams();

  const handleClickNewView = () => {
    history.push('/dashboard/custom_views/accounts/new');
  };
  const tabs = views.map(view => {
    const baseUrl = '/dashboard/accounts';
    const link = (
      <Link to={`${baseUrl}/${view.id}/custom_view`}>{view.name}</Link>
    );
    return <Tab id={`custom_view_${view.id}`} title={link} />;
  });
  return (
    <Navbar className='navbar--dashboard-views'>
      <NavbarGroup align={Alignment.LEFT}>
        <Tabs
          id='navbar'
          large={true}
          selectedTabId={`custom_view_${customViewId}`}
          className='tabs--dashboard-views'
        >
          <Tab id='all' title={<Link to={`/dashboard/accounts`}>All</Link>} />

          {tabs}
          <Button
            className='button--new-view'
            icon={<Icon icon='plus' />}
            onClick={handleClickNewView}
          />
        </Tabs>
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(AccountsConnect)(AccountsViewsTabs);
