import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import { useExpensesListContext } from './ExpensesListProvider';
import withExpenses from './withExpenses';
import withExpensesActions from './withExpensesActions';

import { compose } from 'utils';

/**
 * Expesne views tabs.
 */
function ExpenseViewTabs({
  // #withExpensesActions
  setExpensesTableState,
  
  // #withExpenses
  expensesTableState
}) {
  // Expenses list context.
  const { expensesViews } = useExpensesListContext();

  // Handle the tabs change.
  const handleTabChange = (viewId) => {
    setExpensesTableState({
      customViewId: viewId || null,
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
          customViewId={expensesTableState.customViewId}
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
  withExpenses(({ expensesTableState }) => ({ expensesTableState }))
)(ExpenseViewTabs);
