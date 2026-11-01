import { DialogsName } from '@/constants/dialogs';
import { index as EstimatePdfPreviewDialog } from '@/containers/Dialogs/EstimatePdfPreviewDialog';
import { EstimateBulkDeleteDialog } from '@/containers/Dialogs/Estimates/EstimateBulkDeleteDialog';

export function EstimatesListDialogs() {
  return (
    <>
      <EstimateBulkDeleteDialog dialogName={DialogsName.EstimateBulkDelete} />
      <EstimatePdfPreviewDialog dialogName={DialogsName.EstimatePdfForm} />
    </>
  );
}
