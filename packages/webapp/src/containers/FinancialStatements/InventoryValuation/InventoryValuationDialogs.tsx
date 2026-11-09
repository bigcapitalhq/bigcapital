import { InventoryValuationPdfDialog } from './dialogs/InventoryValuationPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function InventoryValuationDialogs() {
  return (
    <>
      <InventoryValuationPdfDialog
        dialogName={DialogsName.InventoryValuationPdfPreview}
      />
    </>
  );
}
