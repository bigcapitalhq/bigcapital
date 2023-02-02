// @ts-nocheck
import React from 'react';

import '@/style/components/Drawers/ItemDrawer.scss';

import { DrawerBody } from '@/components';
import ItemContentDetails from './ItemContentDetails';
import { ItemDetailDrawerProvider } from './ItemDetailDrawerProvider';

/**
 * Item detail drawer content.
 */
export default function ItemDetailDrawerContent({
  // #ownProp
  itemId,
}) {
  return (
    <ItemDetailDrawerProvider itemId={itemId}>
      <DrawerBody>
        <ItemContentDetails />
      </DrawerBody>
    </ItemDetailDrawerProvider>
  );
}
