import React, { useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { compose } from 'utils';
import { DashboardViewsTabs } from 'components';
import { pick } from 'lodash';

import withItemsActions from 'containers/Items/withItemsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetail from 'containers/Views/withViewDetails';
import withItems from 'containers/Items/withItems';

/**
 * Items views tabs.
 */
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
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');
  }, [customViewId]);

  const handleClickNewView = () => {};

  const tabs = itemsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleTabChange = (viewId) => {
    changeItemsCurrentView(viewId || -1);
    addItemsTableQueries({
      custom_view_id: viewId || null,
    });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'items'}
          tabs={tabs}
          onChange={handleTabChange}
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
