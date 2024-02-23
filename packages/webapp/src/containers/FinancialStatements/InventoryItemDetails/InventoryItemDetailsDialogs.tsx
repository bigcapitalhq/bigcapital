import { DialogsName } from '@/constants/dialogs';
import { InventoryItemDetailsPdfDialog } from './dialogs/InventoryItemDetailsPdfDialog';

export function InventoryItemDetailsDialogs() {
  return (
    <>
      <InventoryItemDetailsPdfDialog
        dialogName={DialogsName.InventoryItemDetailsPdfPreview}
      />
    </>
  );
}
