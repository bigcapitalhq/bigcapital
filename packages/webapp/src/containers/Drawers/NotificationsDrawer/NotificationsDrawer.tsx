// @ts-nocheck
import React, { lazy } from 'react';
import * as R from 'ramda';
import { Drawer, DrawerHeaderContent, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { Position } from '@blueprintjs/core';
import { DRAWERS } from '@/constants/drawers';

const NotificationsDrawerContent = lazy(() => import('./NotificationsDrawerContent'));

/**
 * Notifications drawer.
 */
function NotificationsDrawer({
  name,
  // #withDrawer
  isOpen,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      size={'400px'}
      position={Position.RIGHT}
    >
      <DrawerSuspense>
        <DrawerHeaderContent
          name={DRAWERS.NOTIFICATIONS}
          title={'Notifications'}
        />
        <NotificationsDrawerContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export default R.compose(withDrawers())(NotificationsDrawer);
