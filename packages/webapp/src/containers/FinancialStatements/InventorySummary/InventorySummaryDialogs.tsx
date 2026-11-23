import { InventorySummaryPdfDialog } from './dialogs/InventorySummaryPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function InventorySummaryDialogs() {
  return (
    <>
      <InventorySummaryPdfDialog
        dialogName={DialogsName.InventorySummaryPdfPreview}
      />
    </>
  );
}
