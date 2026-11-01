import React from 'react';
import { ItemDetailActionsBar } from './ItemDetailActionsBar';
import { ItemDetailTab } from './ItemDetailTab';

/**
 * Item detail.
 */
export function ItemDetail() {
  return (
    <div className="item-drawer">
      <ItemDetailActionsBar />
      <ItemDetailTab />
    </div>
  );
}
