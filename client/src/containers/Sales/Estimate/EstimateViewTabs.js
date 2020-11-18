import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pick, debounce } from 'lodash';

import { DashboardViewsTabs } from 'components';
import { useUpdateEffect } from 'hooks';

import withEstimates from './withEstimates';
import withEstimateActions from './withEstimateActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import { compose } from 'utils';

function EstimateViewTabs({
  // #withExpenses
  estimateViews,

  // #withViewDetails
  viewItem,

  //#withEstimatesActions
  addEstimatesTableQueries,
  changeEstimateView,

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
    changeEstimateView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');

    addEstimatesTableQueries({
      custom_view_id: customViewId,
    });
    return () => {
      setTopbarEditView(null);
      changePageSubtitle('');
      changeEstimateView(null);
    };
  }, [customViewId, addEstimatesTableQueries, changeEstimateView]);

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
    debounceChangeHistory.current(`/estimates/${toPath}`);
    setTopbarEditView(viewId);
  };
  const tabs = estimateViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handle click a new view tab.
  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/estimates/new');
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          baseUrl={'/estimates'}
          tabs={tabs}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

const mapStateToProps = (state, ownProps) => ({
  viewId: ownProps.match.params.custom_view_id,
});

const withEstimatesViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withEstimatesViewTabs,
  withEstimateActions,
  withDashboardActions,
  withViewDetails(),
  withEstimates(({ estimateViews }) => ({
    estimateViews,
  })),
)(EstimateViewTabs);
