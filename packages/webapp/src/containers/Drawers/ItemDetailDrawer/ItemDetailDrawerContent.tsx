import React from 'react';

import '@/style/components/Drawers/ItemDrawer.scss';

import { ItemDetail as ItemContentDetails } from './ItemContentDetails';
import { ItemDetailDrawerProvider } from './ItemDetailDrawerProvider';
import { DrawerBody } from '@/components';

interface ItemDetailDrawerContentProps {
  itemId: number | undefined;
}

/**
 * Item detail drawer content.
 */
export function ItemDetailDrawerContent({
  itemId,
}: ItemDetailDrawerContentProps) {
  return (
    <ItemDetailDrawerProvider itemId={itemId}>
      <DrawerBody>
        <ItemContentDetails />
      </DrawerBody>
    </ItemDetailDrawerProvider>
  );
}
