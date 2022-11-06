// @ts-nocheck
import React from 'react';

import { DrawerBody } from '@/components';

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
      <DrawerBody>
        <ExpenseDrawerDetails />
      </DrawerBody>
    </ExpenseDrawerProvider>
  );
}
