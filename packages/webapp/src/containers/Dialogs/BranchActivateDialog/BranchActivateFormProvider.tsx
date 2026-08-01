import React, { createContext } from 'react';
import { DialogContent } from '@/components';
import { useActivateBranches } from '@/hooks/query';

interface BranchActivateContextValue {
  activateBranches: (id: number | string) => Promise<unknown>;
  dialogName: string;
}

const BranchActivateContext = createContext<BranchActivateContextValue>(
  {} as BranchActivateContextValue,
);

interface BranchActivateFormProviderProps {
  dialogName: string;
  children?: React.ReactNode;
}

/**
 * Branch activate form provider.
 */
function BranchActivateFormProvider({
  dialogName,
  ...props
}: BranchActivateFormProviderProps) {
  const { mutateAsync: activateBranches } = useActivateBranches();

  // State provider.
  const provider: BranchActivateContextValue = {
    activateBranches,
    dialogName,
  };

  return (
    <DialogContent>
      <BranchActivateContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useBranchActivateContext = () => React.useContext(BranchActivateContext);

export { BranchActivateFormProvider, useBranchActivateContext };
