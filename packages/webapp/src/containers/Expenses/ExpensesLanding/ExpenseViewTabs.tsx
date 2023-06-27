// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';

import { useExpensesListContext } from './ExpensesListProvider';
import withExpenses from './withExpenses';
import withExpensesActions from './withExpensesActions';

import { compose, transformViewsToTabs } from '@/utils';

/**
 * Expense views tabs.
 */
function ExpenseViewTabs({
  // #withExpensesActions
  setExpensesTableState,

  // #withExpenses
  expensesCurrentView,
}) {
  // Expenses list context.
  const { expensesViews } = useExpensesListContext();

  // Handle the tabs change.
  const handleTabChange = (viewSlug) => {
    setExpensesTableState({
      viewSlug: viewSlug || null,
    });
  };

  const tabs = transformViewsToTabs(expensesViews);

  // Handle click a new view tab.
  const handleClickNewView = () => {};

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={expensesCurrentView}
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
  withExpenses(({ expensesTableState }) => ({
    expensesCurrentView: expensesTableState.viewSlug,
  })),
)(ExpenseViewTabs);
