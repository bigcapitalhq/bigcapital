import React from 'react';
import clsx from 'classnames';

import { Card } from 'components';

import InventoryAdjustmentDetailActionsBar from './InventoryAdjustmentDetailActionsBar';
import InventoryAdjustmentDetailHeader from './InventoryAdjustmentDetailHeader';
import InventoryAdjustmentDetailTable from './InventoryAdjustmentDetailTable';

import InventoryAdjustmentDrawerCls from 'style/components/Drawers/InventoryAdjustmentDrawer.module.scss';

/**
 * Inventory adjustment detail
 */
export default function InventoryAdjustmentDetail() {
  return (
    <div className={clsx(InventoryAdjustmentDrawerCls.detail_panel)}>
      <InventoryAdjustmentDetailActionsBar />

      <Card>
        <InventoryAdjustmentDetailHeader />
        <InventoryAdjustmentDetailTable />
      </Card>
    </div>
  );
}
