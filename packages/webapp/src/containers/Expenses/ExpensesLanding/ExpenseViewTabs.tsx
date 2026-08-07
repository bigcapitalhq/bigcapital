import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import { useExpensesListContext } from './ExpensesListProvider';
import { withExpenses } from './withExpenses';
import { withExpensesActions } from './withExpensesActions';
import type { WithExpensesProps } from './withExpenses';
import type { WithExpensesActionsProps } from './withExpensesActions';
import { DashboardViewsTabs } from '@/components';
import { compose, transfromViewsToTabs } from '@/utils';

interface ExpenseViewTabsInnerProps extends WithExpensesActionsProps {
  expensesCurrentView: WithExpensesProps['expensesTableState']['viewSlug'];
}

/**
 * Expesne views tabs.
 */
function ExpenseViewTabsInner({
  // #withExpensesActions
  setExpensesTableState,

  // #withExpenses
  expensesCurrentView,
}: ExpenseViewTabsInnerProps) {
  // Expenses list context.
  const { expensesViews } = useExpensesListContext();

  // Handle the tabs change.
  const handleTabChange = (viewSlug: string) => {
    setExpensesTableState({
      viewSlug: viewSlug || (null as unknown as string),
    });
  };

  // `transfromViewsToTabs` is untyped; surface as `unknown[]`.
  const tabs = transfromViewsToTabs(expensesViews) as unknown[];

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
