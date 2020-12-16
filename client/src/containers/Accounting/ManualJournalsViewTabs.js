import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pick } from 'lodash';

import { DashboardViewsTabs, Icon } from 'components';

import withManualJournals from './withManualJournals';
import withManualJournalsActions from './withManualJournalsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetail from 'containers/Views/withViewDetails';

import { compose } from 'utils';

/**
 * Manual journal views tabs.
 */
function ManualJournalsViewTabs({
  // #withViewDetail
  viewId,
  viewItem,

  // #withManualJournals
  manualJournalsViews,

  // #withManualJournalsActions
  addManualJournalsTableQueries,
  changeManualJournalCurrentView,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,

  // #ownProps
  onViewChanged,
}) {
  const { custom_view_id: customViewId } = useParams();

  useEffect(() => {
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');
  }, [customViewId]);

  const tabs = manualJournalsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleClickNewView = () => {};

  const handleTabChange = (viewId) => {
    changeManualJournalCurrentView(viewId || -1);
    addManualJournalsTableQueries({
      custom_view_id: viewId || null,
    });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          resourceName={'manual-journals'}
          initialViewId={customViewId}
          tabs={tabs}
          onChange={handleTabChange}
          onNewViewTabClick={handleClickNewView}
        />
      </NavbarGroup>
    </Navbar>
  );
}

const mapStateToProps = (state, ownProps) => ({
  viewId: parseInt(ownProps.match.params.custom_view_id, 10),
});

const withManualJournalsViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withManualJournalsViewTabs,
  withManualJournals(({ manualJournalsViews }) => ({
    manualJournalsViews,
  })),
  withManualJournalsActions,
  withDashboardActions,
  withViewDetail(),
)(ManualJournalsViewTabs);
