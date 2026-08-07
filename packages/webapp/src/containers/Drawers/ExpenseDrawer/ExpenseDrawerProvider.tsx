import React from 'react';
import intl from 'react-intl-universal';
import type { Expense } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { DRAWERS } from '@/constants/drawers';
import { useExpense } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

export interface ExpenseDrawerContextValue {
  expenseId: number | undefined;
  expense: Expense | undefined;
  isExpenseFetching: boolean;
  isExpenseLoading: boolean;
}

interface ExpenseDrawerProviderProps {
  expenseId: number | undefined;
}

const ExpenseDrawerDrawerContext = React.createContext<
  ExpenseDrawerContextValue | undefined
>(undefined);

/**
 * Expense drawer provider.
 */
function ExpenseDrawerProvider({
  expenseId,
  ...props
}: ExpenseDrawerProviderProps & { children?: React.ReactNode }) {
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
  const provider: ExpenseDrawerContextValue = {
    expenseId,
    expense,

    isExpenseFetching,
    isExpenseLoading,
  };

  return (
    <DrawerLoading loading={isExpenseLoading}>
      <DrawerHeaderContent
        name={DRAWERS.EXPENSE_DETAILS}
        title={intl.get('expense.drawer.title')}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('expense.drawer.subtitle', {
                value: expense?.branch?.name,
              })
            : null
        }
      />
      <ExpenseDrawerDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useExpenseDrawerContext = (): ExpenseDrawerContextValue => {
  const ctx = React.useContext(ExpenseDrawerDrawerContext);
  if (ctx === undefined) {
    throw new Error(
      'useExpenseDrawerContext must be used within an ExpenseDrawerProvider',
    );
  }
  return ctx;
};

export { ExpenseDrawerProvider, useExpenseDrawerContext };
