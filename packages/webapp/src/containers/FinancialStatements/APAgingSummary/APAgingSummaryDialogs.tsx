import { DialogsName } from '@/constants/dialogs';
import { APAgingSummaryPdfDialog } from './dialogs/APAgingSummaryPdfDialog';

export function APAgingSummaryDialogs() {
  return (
    <>
      <APAgingSummaryPdfDialog
        dialogName={DialogsName.APAgingSummaryPdfPreview}
      />
    </>
  );
}
