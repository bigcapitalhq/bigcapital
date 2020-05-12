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
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'utils';
import {useUpdateEffect} from 'hooks';

import withItemsActions from 'containers/Items/withItemsActions';
import withDashboard from 'containers/Dashboard/withDashboard';
import withViewDetail from 'containers/Views/withViewDetails';
import withItems from 'containers/Items/withItems';

import { FormattedMessage as T, useIntl } from 'react-intl';

function ItemsViewsTabs({
  // #withViewDetail
  viewId,
  viewItem,

  // #withItems
  itemsViews,

  // #withItemsActions
  addItemsTableQueries,
  changeItemsCurrentView,

  // #withDashboard
  setTopbarEditView,
  changePageSubtitle,

  // #props
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId } = useParams();

  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/items/new');
  };

  const handleViewLinkClick = () => {
    setTopbarEditView(customViewId);
  }

  useEffect(() => {
    changeItemsCurrentView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle((customViewId && viewItem) ? viewItem.name : '');

    addItemsTableQueries({
      custom_view_id: customViewId || null,
    });

    return () => {
      setTopbarEditView(null);
      changeItemsCurrentView(-1);
      changePageSubtitle('');
    };
  }, [customViewId]);

  useUpdateEffect(() => {
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  const tabs = itemsViews.map(view => {
    const baseUrl = '/items';
    const link = (
      <Link to={`${baseUrl}/${view.id}/custom_view`} onClick={handleViewLinkClick}>
        {view.name}
      </Link>
    );
    return (<Tab id={`custom_view_${view.id}`} title={link} />);
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
            id='all'
            title={<Link to={`/items`}><T id={'all'}/></Link>}
            onClick={handleViewLinkClick} />

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

const mapStateToProps = (state, ownProps) => ({
  // Mapping view id from matched route params.
  viewId: ownProps.match.params.custom_view_id,
});

const withItemsViewsTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withItemsViewsTabs,
  withDashboard,
  withItemsActions,
  withViewDetail,
  withItems( ({ itemsViews }) => ({
    itemsViews,
  }))
)(ItemsViewsTabs);
