// @ts-nocheck
import { Position } from '@blueprintjs/core';
import React, { lazy } from 'react';
import { Drawer, DrawerHeaderContent, DrawerSuspense } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const NotificationsDrawerContent = lazy(
  () => import('./NotificationsDrawerContent'),
);

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

export default withDrawers()(NotificationsDrawer);
