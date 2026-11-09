import React from 'react';
import { ExpenseDrawerDetails } from './ExpenseDrawerDetails';
import { ExpenseDrawerProvider } from './ExpenseDrawerProvider';
import { DrawerBody } from '@/components';

interface ExpenseDrawerContentProps {
  expenseId: number | undefined;
}

/**
 * Expense drawer content.
 */
export function ExpenseDrawerContent({ expenseId }: ExpenseDrawerContentProps) {
  return (
    <ExpenseDrawerProvider expenseId={expenseId}>
      <DrawerBody>
        <ExpenseDrawerDetails />
      </DrawerBody>
    </ExpenseDrawerProvider>
  );
}
