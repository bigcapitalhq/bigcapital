// @ts-nocheck
import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const ExpenseDrawerContent = lazy(() =>
  import('./ExpenseDrawerContent').then((m) => ({
    default: m.ExpenseDrawerContent,
  })),
);

/**
 * Expense drawer.
 */
function ExpenseDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { expenseId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      size={'65%'}
      style={{ minWidth: '700px', maxWidth: '900px' }}
    >
      <DrawerSuspense>
        <ExpenseDrawerContent expenseId={expenseId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(ExpenseDrawer);
