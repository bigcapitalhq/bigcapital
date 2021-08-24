import React from 'react';

import ItemDetailActionsBar from './ItemDetailActionsBar';
import ItemDetailHeader from './ItemDetailHeader';

import { Card } from 'components';

/**
 * Item detail.
 */
export default function ItemDetail() {
  return (
    <div className="item-drawer">
      <ItemDetailActionsBar />

      <Card>
        <ItemDetailHeader />
      </Card>
    </div>
  );
}
