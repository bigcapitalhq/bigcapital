import React from 'react';
import intl from 'react-intl-universal';
import { useExpense } from 'hooks/query';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from 'common';
import { useFeatureCan } from 'hooks/state';

const ExpenseDrawerDrawerContext = React.createContext();

/**
 * Expense drawer provider.
 */
function ExpenseDrawerProvider({ expenseId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Fetch the expense details.
  const {
    data: expense,
    isLoading: isExpenseLoading,
    isFetching: isExpenseFetching,
  } = useExpense(expenseId, {
    enabled: !!expenseId,
  });

  // Provider.
  const provider = {
    expenseId,
    expense,

    isExpenseFetching,
    isExpenseLoading,
  };

  return (
    <DrawerLoading loading={isExpenseLoading}>
      <DrawerHeaderContent
        name="expense-drawer"
        title={intl.get('expense.drawer.title')}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('expense.drawer.subtitle', {
                value: expense.branch?.name,
              })
            : null
        }
      />
      <ExpenseDrawerDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}
const useExpenseDrawerContext = () =>
  React.useContext(ExpenseDrawerDrawerContext);

export { ExpenseDrawerProvider, useExpenseDrawerContext };
