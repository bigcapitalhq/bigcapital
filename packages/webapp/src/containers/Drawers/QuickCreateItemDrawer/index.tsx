import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const QuickCretaeItemDrawerContent = lazy(() =>
  import('./QuickCreateItemDrawerContent').then((m) => ({
    default: m.QuickCreateItemDrawerContent,
  })),
);

interface QuickCreateItemDrawerProps {
  name: string;
  isOpen: boolean;
  payload: { name?: string; quickActionEvent?: unknown } & Record<
    string,
    unknown
  >;
}

function QuickCreateItemDrawer({
  name,
  isOpen,
  payload,
}: QuickCreateItemDrawerProps): React.ReactElement {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '800px', maxWidth: '1000px' }}
      size={'72%'}
      payload={payload}
    >
      <DrawerSuspense>
        <QuickCretaeItemDrawerContent itemName={payload.name} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = FF.pipe(QuickCreateItemDrawer, withDrawers());
