import React, { createContext } from 'react';
import type { BranchFormContextValue } from './types';
import { DialogContent } from '@/components';
import { useBranch, useCreateBranch, useEditBranch } from '@/hooks/query';

const BranchFormContext = createContext<BranchFormContextValue>(
  {} as BranchFormContextValue,
);

interface BranchFormProviderProps {
  dialogName: string;
  branchId?: number | null;
  children?: React.ReactNode;
}

/**
 * Branch form dialog provider.
 */
function BranchFormProvider({
  dialogName,
  branchId,
  ...props
}: BranchFormProviderProps) {
  // Create and edit branch mutations.
  const { mutateAsync: createBranchMutate } = useCreateBranch();
  const { mutateAsync: editBranchMutate } = useEditBranch();

  // Handle fetch branch detail.
  const { data: branch, isLoading: isBranchLoading } = useBranch(branchId, {
    enabled: !!branchId,
  });

  // State provider.
  const provider: BranchFormContextValue = {
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
