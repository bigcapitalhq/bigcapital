import React from 'react';
import { DialogContent } from 'components';
// import {} from 'hooks/query';

const BranchFormContext = React.createContext();

/**
 * Branch form dialog provider.
 */
function BranchFormProvider({ dialogName, ...props }) {
  // State provider.
  const provider = {
    dialogName,
  };
  return (
    <DialogContent
    // isLoading={}
    >
      <BranchFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}
const useBranchFormContext = () => React.useContext(BranchFormContext);

export { BranchFormProvider, useBranchFormContext };
