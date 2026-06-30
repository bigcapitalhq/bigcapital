import React from 'react';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from '@/components';

import { useExpensesListContext } from './ExpensesListProvider';
import { withExpenses } from './withExpenses';
import { withExpensesActions } from './withExpensesActions';

import { compose, transfromViewsToTabs } from '@/utils';

import type { WithExpensesProps } from './withExpenses';
import type { WithExpensesActionsProps } from './withExpensesActions';

interface ExpenseViewTabsInnerProps
  extends Pick<WithExpensesActionsProps, 'setExpensesTableState'> {
  expensesCurrentView: WithExpensesProps['expensesTableState']['viewSlug'];
}

/**
 * Expesne views tabs.
 */
function ExpenseViewTabsInner({
  setExpensesTableState,
  expensesCurrentView,
}: ExpenseViewTabsInnerProps) {
  // Expenses list context.
  const { expensesViews } = useExpensesListContext();

  // Handle the tabs change.
  const handleTabChange = (viewSlug: string | null | undefined) => {
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

export const ExpenseViewTabs = compose(
  withExpensesActions,
  withExpenses(({ expensesTableState }) => ({
    expensesCurrentView: expensesTableState.viewSlug,
  })),
)(ExpenseViewTabsInner);
