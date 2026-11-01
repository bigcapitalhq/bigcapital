import { DRAWERS } from '@/constants/drawers';
import { index as InventoryAdjustmentDetailDrawer } from '@/containers/Drawers/InventoryAdjustmentDetailDrawer';

export function InventoryAdjustmentListDrawers() {
  return (
    <>
      <InventoryAdjustmentDetailDrawer
        name={DRAWERS.INVENTORY_ADJUSTMENT_DETAILS}
      />
    </>
  );
}
