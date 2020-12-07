import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import withExpenses from './withExpenses';
import withExpensesActions from './withExpensesActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import { compose } from 'utils';

/**
 * Expesne views tabs.
 */
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

  // props
  customViewChanged,
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');
  }, [customViewId]);

  const handleTabChange = (viewId) => {
    changeExpensesView(viewId || -1);
    addExpensesTableQueries({
      custom_view_id: viewId || null,
    });
  };
  const tabs = expensesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handle click a new view tab.
  const handleClickNewView = () => {};

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          resourceName={'expenses'}
          tabs={tabs}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabChange}
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
  withExpensesViewTabs,
  withExpensesActions,
  withDashboardActions,
  withViewDetails(),
  withExpenses(({ expensesViews }) => ({
    expensesViews,
  })),
)(ExpenseViewTabs);
