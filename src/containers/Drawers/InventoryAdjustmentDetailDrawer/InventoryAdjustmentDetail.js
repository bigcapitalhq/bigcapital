import React from 'react';
import styled from 'styled-components';

import { Card } from 'components';

import InventoryAdjustmentDetailActionsBar from './InventoryAdjustmentDetailActionsBar';
import InventoryAdjustmentDetailHeader from './InventoryAdjustmentDetailHeader';
import InventoryAdjustmentDetailTable from './InventoryAdjustmentDetailTable';

/**
 * Inventory adjustment detail
 */
export default function InventoryAdjustmentDetail() {
  return (
    <InventoryAdjustmentDetailsRoot>
      <InventoryAdjustmentDetailActionsBar />

      <Card>
        <InventoryAdjustmentDetailHeader />
        <InventoryAdjustmentDetailTable />
      </Card>
    </InventoryAdjustmentDetailsRoot>
  );
}

const InventoryAdjustmentDetailsRoot = styled.div``;
