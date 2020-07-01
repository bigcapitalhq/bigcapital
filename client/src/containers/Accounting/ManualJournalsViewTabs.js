import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import {
  Alignment,
  Navbar,
  NavbarGroup,
} from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pick, debounce } from 'lodash';

import { useUpdateEffect } from 'hooks';
import { DashboardViewsTabs, Icon } from 'components';

import withManualJournals from './withManualJournals';
import withManualJournalsActions from './withManualJournalsActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetail from 'containers/Views/withViewDetails';

import { compose } from 'utils';

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
  const history = useHistory();
  const { custom_view_id: customViewId } = useParams();

  useEffect(() => {
    changeManualJournalCurrentView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');

    addManualJournalsTableQueries({
      custom_view_id: customViewId,
    });
  }, [customViewId, addManualJournalsTableQueries]);

  useUpdateEffect(() => {
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  const tabs = manualJournalsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const debounceChangeHistory = useRef(
    debounce((toUrl) => {
      history.push(toUrl);
    }, 250),
  );

  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/manual_journals/new');
  };

  const handleTabChange = (viewId) => {
    const toPath = viewId ? `${viewId}/custom_view` : '';
    debounceChangeHistory.current(`/manual-journals/${toPath}`);
    setTopbarEditView(viewId);
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          baseUrl={'/manual-journals'}
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
