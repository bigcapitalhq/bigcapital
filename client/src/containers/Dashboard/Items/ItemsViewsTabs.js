import React, {useEffect} from 'react';
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
import ItemsConnect from 'connectors/Items.connect';
import DashboardConnect from 'connectors/Dashboard.connector';
import {useUpdateEffect} from 'hooks';

function ItemsViewsTabs({
  views,
  setTopbarEditView,
  customViewChanged,
  addItemsTableQueries,
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId } = useParams();

  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/dashboard/custom_views/items/new');
  };
  const handleViewLinkClick = () => {
    setTopbarEditView(customViewId);
  }

  useUpdateEffect(() => {
    customViewChanged && customViewChanged(customViewId);

    addItemsTableQueries({
      custom_view_id: customViewId || null,
    });
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  useEffect(() => {
    addItemsTableQueries({
      custom_view_id: customViewId,
    })   
  }, [customViewId, addItemsTableQueries]);

  const tabs = views.map(view => {
    const baseUrl = '/dashboard/items';
    const link = (
      <Link
        to={`${baseUrl}/${view.id}/custom_view`}
        onClick={handleViewLinkClick}
      >{view.name}</Link>
    );
    return <Tab
      id={`custom_view_${view.id}`}
      title={link} />;
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
          <Tab
            id='all'
            title={<Link to={`/dashboard/items`}>All</Link>} />

          {tabs}
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
  ItemsConnect,
  DashboardConnect,
)(ItemsViewsTabs);
