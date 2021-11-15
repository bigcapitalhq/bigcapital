import React from 'react';

import ItemDetailActionsBar from './ItemDetailActionsBar';
import ItemDetailHeader from './ItemDetailHeader';
import { ItemPaymentTransactions } from './ItemPaymentTransactions';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { Card } from 'components';

/**
 * Item detail.
 */
export default function ItemDetail() {
  return (
    <div className="item-drawer">
      <ItemDetailActionsBar />
      <ItemPaymentTransactions />
      <Card>
        <ItemDetailHeader />
      </Card>
    </div>
  );
}
