// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { flow } from 'fp-ts/function';

const ItemDetailDrawerContent = React.lazy(() =>
  import('./ItemDetailDrawerContent').then((m) => ({
    default: m.ItemDetailDrawerContent,
  })),
);

/**
 * Item Detail drawer.
 */
function ItemDetailDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { itemId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <ItemDetailDrawerContent itemId={itemId} />
      </DrawerSuspense>
    </Drawer>
  );
}
export const index = flow(withDrawers())(ItemDetailDrawer);
