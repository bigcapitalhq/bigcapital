import React from 'react';
import { BranchActivateForm } from './BranchActivateForm';
import { BranchActivateFormProvider } from './BranchActivateFormProvider';

interface BranchActivateDialogContentProps {
  dialogName: string;
}

export function BranchActivateDialogContent({
  dialogName,
}: BranchActivateDialogContentProps): React.ReactElement {
  return (
    <BranchActivateFormProvider dialogName={dialogName}>
      <BranchActivateForm />
    </BranchActivateFormProvider>
  );
}
