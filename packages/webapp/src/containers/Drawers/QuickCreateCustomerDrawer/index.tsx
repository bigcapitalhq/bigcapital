// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const QuickCreateCustomerDrawerContent = React.lazy(() =>
  import('./QuickCreateCustomerDrawerContent').then((m) => ({
    default: m.QuickCreateCustomerDrawerContent,
  })),
);

/**
 * Quick Create customer
 */
function QuickCreateCustomerDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { autofillRef, displayName },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'80%'}
    >
      <DrawerSuspense>
        <QuickCreateCustomerDrawerContent
          displayName={displayName}
          autofillRef={autofillRef}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(QuickCreateCustomerDrawer);
