import { InventoryItemDetailsPdfDialog } from './dialogs/InventoryItemDetailsPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function InventoryItemDetailsDialogs() {
  return (
    <>
      <InventoryItemDetailsPdfDialog
        dialogName={DialogsName.InventoryItemDetailsPdfPreview}
      />
    </>
  );
}
