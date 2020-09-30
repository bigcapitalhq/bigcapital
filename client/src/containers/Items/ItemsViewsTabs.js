import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import {
  Alignment,
  Navbar,
  NavbarGroup,
  Tabs,
  Tab,
  Button,
} from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';
import { DashboardViewsTabs } from 'components';
import { pick, debounce } from 'lodash';

import withItemsActions from 'containers/Items/withItemsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetail from 'containers/Views/withViewDetails';
import withItems from 'containers/Items/withItems';

import { FormattedMessage as T } from 'react-intl';

function ItemsViewsTabs({
  // #withViewDetail
  viewId,
  viewItem,

  // #withItems
  itemsViews,

  // #withItemsActions
  addItemsTableQueries,
  changeItemsCurrentView,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,

  // #props
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/items/new');
  };

  const handleViewLinkClick = () => {
    setTopbarEditView(customViewId);
  };

  useEffect(() => {
    changeItemsCurrentView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');

    addItemsTableQueries({
      custom_view_id: customViewId || null,
    });

    return () => {
      setTopbarEditView(null);
      changeItemsCurrentView(-1);
      changePageSubtitle('');
    };
  }, [customViewId, addItemsTableQueries, changeItemsCurrentView]);

  useUpdateEffect(() => {
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  const debounceChangeHistory = useRef(
    debounce((toUrl) => {
      history.push(toUrl);
    }, 250),
  );

  const handleTabsChange = (viewId) => {
    const toPath = viewId ? `${viewId}/custom_view` : '';
    debounceChangeHistory.current(`/items/${toPath}`);
    setTopbarEditView(viewId);
  };

  const tabs = itemsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));
  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          baseUrl={'/items'}
          tabs={tabs}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
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
  withDashboardActions,
  withItemsActions,
  withViewDetail(),
  withItems(({ itemsViews }) => ({
    itemsViews,
  })),
)(ItemsViewsTabs);
