import { ProfitLossSheetPdfDialog } from './ProfitLossSheetPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export function ProfitLossSheetDialogs() {
  return (
    <>
      <ProfitLossSheetPdfDialog
        dialogName={DialogsName.ProfitLossSheetPdfPreview}
      />
    </>
  );
}
