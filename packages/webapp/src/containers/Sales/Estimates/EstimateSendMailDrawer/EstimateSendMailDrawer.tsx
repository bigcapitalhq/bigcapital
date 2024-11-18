// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const EstimateSendMailContent = React.lazy(() =>
  import('./EstimateSendMailContent').then((module) => ({
    default: module.EstimateSendMailContent,
  })),
);

interface EstimateSendMailDrawerProps {
  name: string;
  isOpen?: boolean;
  payload?: any;
}

function EstimateSendMailDrawerRoot({
  name,

  // #withDrawer
  isOpen,
  payload,
}: EstimateSendMailDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      payload={payload}
      size={'calc(100% - 10px)'}
    >
      <DrawerSuspense>
        <EstimateSendMailContent />
      </DrawerSuspense>
    </Drawer>
  );
}

export const EstimateSendMailDrawer = R.compose(withDrawers())(
  EstimateSendMailDrawerRoot,
);
