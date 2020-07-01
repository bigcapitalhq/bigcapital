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

import { DashboardViewsTabs } from 'components';

import withExpenses from './withExpenses';
import withExpensesActions from './withExpensesActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import { compose } from 'utils';

function ExpenseViewTabs({
  // #withExpenses
  expensesViews,

  // #withViewDetails
  viewItem,

  // #withExpensesActions
  addExpensesTableQueries,
  changeExpensesView,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId } = useParams();

  useEffect(() => {
    changeExpensesView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');

    addExpensesTableQueries({
      custom_view_id: customViewId,
    });
    return () => {
      setTopbarEditView(null);
      changePageSubtitle('');
      changeExpensesView(null);
    };
  }, [customViewId, addExpensesTableQueries, changeExpensesView]);

  const debounceChangeHistory = useRef(
    debounce((toUrl) => {
      history.push(toUrl);
    }, 250),
  );

  const handleTabsChange = (viewId) => {
    const toPath = viewId ? `${viewId}/custom_view` : '';
    debounceChangeHistory.current(`/expenses/${toPath}`);
    setTopbarEditView(viewId);
  };

  const tabs = expensesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handle click a new view tab.
  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/expenses/new');
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          baseUrl={'/expenses'}
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

const withExpensesViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withViewDetails(),
  withExpensesViewTabs,
  withExpenses(({ expensesViews }) => ({
    expensesViews,
  })),
  withExpensesActions,
  withDashboardActions,
)(ExpenseViewTabs);
