// @ts-nocheck
import React, { lazy } from 'react';
import * as R from 'ramda';
import { Drawer, DrawerHeaderContent, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { Position } from '@blueprintjs/core';
import { DRAWERS } from '@/constants/drawers';
import { flow } from 'fp-ts/function';

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

export const ChangeSubscriptionPlanDrawer = flow(withDrawers())(
  ChangeSubscriptionPlanDrawerInner,
);
