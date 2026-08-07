import React, { lazy } from 'react';
import type { WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const CategorizeTransactionContent = lazy(() =>
  import('./CategorizeTransactionContent').then((m) => ({
    default: m.CategorizeTransactionContent,
  })),
);

interface CategorizeTransactionDrawerInnerProps extends WithDrawersProps {
  name: string;
}

/**
 * Categorize the uncategorized transaction drawer.
 */
function CategorizeTransactionDrawerInner({
  name,
  // #withDrawer
  isOpen,
}: CategorizeTransactionDrawerInnerProps) {
  // `CategorizeTransactionContent` reads its selected IDs from the banking
  // store via `withBanking`, so we don't pass any payload prop here. The
  // drawer's payload (`uncategorizedTransactionId`) is consumed upstream by
  // the code that sets `transactionsToCategorizeSelected` in the store.
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '480px', maxWidth: '600px' }}
      size={'40%'}
    >
      <DrawerSuspense>
        <CategorizeTransactionContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const CategorizeTransactionDrawer = compose(withDrawers())(
  CategorizeTransactionDrawerInner,
);
