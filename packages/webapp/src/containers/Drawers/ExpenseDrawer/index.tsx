import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const ExpenseDrawerContent = lazy(() =>
  import('./ExpenseDrawerContent').then((m) => ({
    default: m.ExpenseDrawerContent,
  })),
);

interface ExpenseDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Expense drawer.
 */
function ExpenseDrawer({ name, isOpen, payload }: ExpenseDrawerProps) {
  const expenseId = payload?.expenseId as number | undefined;

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

export const index = compose(withDrawers())(ExpenseDrawer);
