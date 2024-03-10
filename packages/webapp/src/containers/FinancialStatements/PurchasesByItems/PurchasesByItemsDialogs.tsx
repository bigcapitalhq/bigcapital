import { DialogsName } from '@/constants/dialogs';
import { PurchasesByItemsPdfDialog } from './dialogs/PurchasesByItemsDialog';

export function PurchasesByItemsDialogs() {
  return (
    <>
      <PurchasesByItemsPdfDialog
        dialogName={DialogsName.PurchasesByItemsPdfPreview}
      />
    </>
  );
}
