import { InventoryAdjustmentDetailHeader } from './InventoryAdjustmentDetailHeader';
import { InventoryAdjustmentDetailTable } from './InventoryAdjustmentDetailTable';
import { CommercialDocBox } from '@/components';

export function InventoryAdjustmentDetailTab() {
  return (
    <CommercialDocBox>
      <InventoryAdjustmentDetailHeader />
      <InventoryAdjustmentDetailTable />
    </CommercialDocBox>
  );
}
