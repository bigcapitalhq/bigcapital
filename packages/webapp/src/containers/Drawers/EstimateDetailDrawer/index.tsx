// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const EstimateDetailDrawerContent = React.lazy(() =>
  import('./EstimateDetailDrawerContent').then((m) => ({
    default: m.EstimateDetailDrawerContent,
  })),
);

function EstimateDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { estimateId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <EstimateDetailDrawerContent estimateId={estimateId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = flow(withDrawers())(EstimateDetailDrawer);
