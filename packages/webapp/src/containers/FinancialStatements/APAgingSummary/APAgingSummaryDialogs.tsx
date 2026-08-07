import { APAgingSummaryPdfDialog } from './dialogs/APAgingSummaryPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function APAgingSummaryDialogs() {
  return (
    <>
      <APAgingSummaryPdfDialog
        dialogName={DialogsName.APAgingSummaryPdfPreview}
      />
    </>
  );
}
