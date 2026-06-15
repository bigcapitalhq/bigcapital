// @ts-nocheck
import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';

import { useExpensesListContext } from './ExpensesListProvider';
import { withExpenses } from './withExpenses';
import { withExpensesActions } from './withExpensesActions';

import { transfromViewsToTabs } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Expesne views tabs.
 */
function ExpenseViewTabsInner({
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

  const tabs = transfromViewsToTabs(expensesViews);

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

export const ExpenseViewTabs = flow(
  withExpenses(({ expensesTableState }) => ({
    expensesCurrentView: expensesTableState.viewSlug,
  })),
  withExpensesActions,
)(ExpenseViewTabsInner);
