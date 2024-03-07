// @ts-nocheck
import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const CategorizeTransactionContent = lazy(
  () => import('./CategorizeTransactionContent'),
);

/**
 * Categorize the uncategorized transaction drawer.
 */
function CategorizeTransactionDrawer({
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

export default compose(withDrawers())(CategorizeTransactionDrawer);
