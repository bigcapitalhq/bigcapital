import { DialogsName } from '@/constants/dialogs';
import { TrialBalanceSheetPdfDialog } from './dialogs/TrialBalanceSheetPdfDialog';

export const TrialBalanceSheetDialogs = () => {
  return (
    <>
      <TrialBalanceSheetPdfDialog
        dialogName={DialogsName.TrialBalanceSheetPdfPreview}
      />
    </>
  );
};
