import React from 'react';

import '../../../style/pages/Branches/BranchFormDialog.scss';

import { BranchFormProvider } from './BranchFormProvider';
import BranchForm from './BranchForm';

/**
 * Branch form dialog content.
 */
export default function BranchFormDialogContent({
  // #ownProps
  dialogName,
}) {
  return (
    <BranchFormProvider dialogName={dialogName}>
      <BranchForm />
    </BranchFormProvider>
  );
}
