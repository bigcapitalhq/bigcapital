import { DialogsName } from '@/constants/dialogs';
import { WarehouseTransferBulkDeleteDialog } from '@/containers/Dialogs/WarehouseTransfers/WarehouseTransferBulkDeleteDialog';

export function WarehouseTransfersListDialogs() {
  return (
    <>
      <WarehouseTransferBulkDeleteDialog
        dialogName={DialogsName.WarehouseTransferBulkDelete}
      />
    </>
  );
}
