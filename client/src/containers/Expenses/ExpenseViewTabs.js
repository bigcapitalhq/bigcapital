import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import { useExpensesListContext } from './ExpensesListProvider';

import withExpensesActions from './withExpensesActions';

import { compose } from 'utils';

/**
 * Expesne views tabs.
 */
function ExpenseViewTabs({
  // #withExpensesActions
  addExpensesTableQueries,  
}) {
  const { expensesViews } = useExpensesListContext();

  const { custom_view_id: customViewId = null } = useParams();

  const handleTabChange = (viewId) => {
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

 
export default compose(
  withExpensesActions,
)(ExpenseViewTabs);
