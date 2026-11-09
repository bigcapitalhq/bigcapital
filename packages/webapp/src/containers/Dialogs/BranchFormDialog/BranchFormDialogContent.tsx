import React from 'react';
import '@/style/pages/Branches/BranchFormDialog.scss';
import { BranchForm } from './BranchForm';
import { BranchFormProvider } from './BranchFormProvider';

interface BranchFormDialogContentProps {
  dialogName: string;
  branchId?: number | null;
}

/**
 * Branch form dialog content.
 */
export function BranchFormDialogContent({
  dialogName,
  branchId,
}: BranchFormDialogContentProps): React.ReactElement {
  return (
    <BranchFormProvider branchId={branchId} dialogName={dialogName}>
      <BranchForm />
    </BranchFormProvider>
  );
}
