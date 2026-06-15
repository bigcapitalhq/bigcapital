// @ts-nocheck
import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const CategorizeTransactionContent = lazy(
  () => import('./CategorizeTransactionContent'),
);

/**
 * Categorize the uncategorized transaction drawer.
 */
function CategorizeTransactionDrawerInner({
  name,
  // #withDrawer
  isOpen,
  payload: { uncategorizedTransactionId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '480px', maxWidth: '600px' }}
      size={'40%'}
    >
      <DrawerSuspense>
        <CategorizeTransactionContent
          uncategorizedTransactionId={uncategorizedTransactionId}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const CategorizeTransactionDrawer = flow(withDrawers())(
  CategorizeTransactionDrawerInner,
);
