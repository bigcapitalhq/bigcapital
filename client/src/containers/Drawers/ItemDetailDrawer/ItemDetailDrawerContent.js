import React from 'react';

import 'style/components/Drawers/ItemDrawer.scss';

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
      <ItemContentDetails />
    </ItemDetailDrawerProvider>
  );
}
