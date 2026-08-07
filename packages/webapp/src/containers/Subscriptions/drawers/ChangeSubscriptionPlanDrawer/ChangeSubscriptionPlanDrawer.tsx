// @ts-nocheck
import { Position } from '@blueprintjs/core';
import * as R from 'ramda';
import React, { lazy } from 'react';
import { Drawer, DrawerHeaderContent, DrawerSuspense } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const ChangeSubscriptionPlanContent = lazy(() =>
  import('./ChangeSubscriptionPlanContent').then((m) => ({
    default: m.ChangeSubscriptionPlanContent,
  })),
);

/**
 * Account drawer.
 */
function ChangeSubscriptionPlanDrawerInner({
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
          name={DRAWERS.CHANGE_SUBSCARIPTION_PLAN}
          title={'Change Subscription Plan'}
        />
        <ChangeSubscriptionPlanContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const ChangeSubscriptionPlanDrawer = R.compose(withDrawers())(
  ChangeSubscriptionPlanDrawerInner,
);
