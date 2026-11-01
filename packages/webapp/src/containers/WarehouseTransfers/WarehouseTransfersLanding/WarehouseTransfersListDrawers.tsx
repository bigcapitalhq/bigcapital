import { DRAWERS } from '@/constants/drawers';
import { index as WarehouseTransferDetailDrawer } from '@/containers/Drawers/WarehouseTransferDetailDrawer';

export function WarehouseTransfersListDrawers() {
  return (
    <>
      <WarehouseTransferDetailDrawer
        name={DRAWERS.WAREHOUSE_TRANSFER_DETAILS}
      />
    </>
  );
}
