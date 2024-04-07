// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const QuickCreateCustomerDrawerContent = React.lazy(() => import('./QuickCreateCustomerDrawerContent'));

/**
 * Quick Create customer
 */
function QuickCreateCustomerDrawer({
  name,

  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <Drawer isOpen={isOpen} name={name} style={{ minWidth: '700px', maxWidth: '900px' }} size={'80%'}>
      <DrawerSuspense>
        <QuickCreateCustomerDrawerContent displayName={payload.displayName} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(QuickCreateCustomerDrawer);
