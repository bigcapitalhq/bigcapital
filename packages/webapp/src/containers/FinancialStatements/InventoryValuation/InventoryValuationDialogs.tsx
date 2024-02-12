import { DialogsName } from '@/constants/dialogs';
import { InventoryValuationPdfDialog } from './dialogs/InventoryValuationPdfDialog';

export function InventoryValuationDialogs() {
  return (
    <>
      <InventoryValuationPdfDialog
        dialogName={DialogsName.InventoryValuationPdfPreview}
      />
    </>
  );
}
