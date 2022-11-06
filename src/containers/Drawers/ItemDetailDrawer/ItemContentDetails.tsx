// @ts-nocheck
import React from 'react';

import ItemDetailTab from './ItemDetailTab';
import ItemDetailActionsBar from './ItemDetailActionsBar';

/**
 * Item detail.
 */
export default function ItemDetail() {
  return (
    <div className="item-drawer">
      <ItemDetailActionsBar />
      <ItemDetailTab />
    </div>
  );
}
