import React from 'react';
import { useItemDetailDrawerContext } from './ItemDetailDrawerProvider';
import ItemDetailActionsBar from './ItemDetailActionsBar';
import ItemDetailList from './ItemDetailList';
import { Card } from 'components';

/**
 * Item detail.
 */
export default function ItemDetail() {
  const { itemId, item } = useItemDetailDrawerContext();

  return (
    <div className="view-detail-drawer">
      <ItemDetailActionsBar itemId={itemId} />
      <Card>
        <ItemDetailList item={item} />
      </Card>
    </div>
  );
}
