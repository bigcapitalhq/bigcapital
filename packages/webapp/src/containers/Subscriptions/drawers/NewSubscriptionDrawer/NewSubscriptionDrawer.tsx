// @ts-nocheck
import React, { lazy } from 'react';
import * as R from 'ramda';
import { Position } from '@blueprintjs/core';
import { Drawer, DrawerHeaderContent, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';
import { DRAWERS } from '@/constants/drawers';

const NewSubscriptionContent = lazy(() =>
  import('./NewSubscriptionContent').then((module) => ({
    default: module.NewSubscriptionContent,
  })),
);

function NewSubscriptionDrawerRoot({
  name,
  // #withDrawer
  isOpen,
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      size={'calc(100% - 5px)'}
      position={Position.BOTTOM}
    >
      <DrawerSuspense>
        <DrawerHeaderContent
          name={DRAWERS.NEW_SUBSCRIPTION_PLANS}
          title={'Renew Subscription Plan'}
        />
        <NewSubscriptionContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const NewSubscriptionDrawer = R.compose(withDrawers())(
  NewSubscriptionDrawerRoot,
);
