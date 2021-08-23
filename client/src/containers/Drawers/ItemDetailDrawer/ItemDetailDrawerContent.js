import React from 'react';

import 'style/components/Drawers/ViewDetail/ViewDetail.scss';

import ItemDetail from './ItemDetail';
import { ItemDetailDrawerProvider } from './ItemDetailDrawerProvider';

/**
 * Item detail drawer content.
 */
export default function ItemDetailDrawerContent({
  // #ownProp
  item,
}) {
  return (
    <ItemDetailDrawerProvider itemId={item}>
      <ItemDetail />
    </ItemDetailDrawerProvider>
  );
}
