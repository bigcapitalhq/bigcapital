import React from 'react';

import 'style/components/Drawers/ViewDetails.scss';

import { ExpenseDrawerProvider } from './ExpenseDrawerProvider';
import ExpenseDrawerDetails from './ExpenseDrawerDetails';

/**
 * Expense drawer content.
 */
export default function ExpenseDrawerContent({
  // #ownProp
  expenseId,
}) {
  return (
    <ExpenseDrawerProvider expenseId={expenseId}>
      <ExpenseDrawerDetails />
    </ExpenseDrawerProvider>
  );
}
