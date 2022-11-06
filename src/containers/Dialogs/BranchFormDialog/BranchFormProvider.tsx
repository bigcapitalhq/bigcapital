// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { useCreateBranch, useEditBranch, useBranch } from '@/hooks/query';

const BranchFormContext = React.createContext();

/**
 * Branch form dialog provider.
 */
function BranchFormProvider({ dialogName, branchId, ...props }) {
  // Create and edit warehouse mutations.
  const { mutateAsync: createBranchMutate } = useCreateBranch();
  const { mutateAsync: editBranchMutate } = useEditBranch();

  // Handle fetch branch detail.
  const { data: branch, isLoading: isBranchLoading } = useBranch(branchId, {
    enabled: !!branchId,
  });

  // State provider.
  const provider = {
    dialogName,
    branch,
    branchId,
    createBranchMutate,
    editBranchMutate,
  };

  return (
    <DialogContent isLoading={isBranchLoading}>
      <BranchFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}
const useBranchFormContext = () => React.useContext(BranchFormContext);

export { BranchFormProvider, useBranchFormContext };
