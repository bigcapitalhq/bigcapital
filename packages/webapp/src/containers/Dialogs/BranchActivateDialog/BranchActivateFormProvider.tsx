// @ts-nocheck
import React from 'react';

import { DialogContent } from '@/components';
import { useActivateBranches } from '@/hooks/query';

const BranchActivateContext = React.createContext();

/**
 * Branch activate form provider.
 */
function BranchActivateFormProvider({ dialogName, ...props }) {
  const { mutateAsync: activateBranches } = useActivateBranches();

  // State provider.
  const provider = {
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
