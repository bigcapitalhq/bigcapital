// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const QuickCreateItemDrawerContent = React.lazy(() =>
  import('./QuickCreateItemDrawerContent'),
);

/**
 * Quick create item.
 */
function QuickCreateItemDrawer({
  // #ownProps
  name,

  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '800px', maxWidth: '1000px' }}
      size={'72%'}
      payload={payload}
    >
      <DrawerSuspense>
        <QuickCreateItemDrawerContent itemName={payload.name} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(QuickCreateItemDrawer);
