import { InventoryTurnoverByAmountPdfDialog } from './dialogs/InventoryTurnoverByAmountPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function InventoryTurnoverByAmountDialogs() {
  return (
    <>
      <InventoryTurnoverByAmountPdfDialog
        dialogName={DialogsName.InventoryTurnoverByAmountPdfPreview}
      />
    </>
  );
}
