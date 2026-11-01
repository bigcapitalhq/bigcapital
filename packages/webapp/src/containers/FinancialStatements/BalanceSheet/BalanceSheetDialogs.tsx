import { BalanceSheetPdfDialog } from './dialogs/BalanceSheetPdfDialog';
import { DialogsName } from '@/constants/dialogs';

export const BalanceSheetDialogs = () => {
  return (
    <>
      <BalanceSheetPdfDialog dialogName={DialogsName.BalanceSheetPdfPreview} />
    </>
  );
};
