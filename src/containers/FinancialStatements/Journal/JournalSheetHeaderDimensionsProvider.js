import React from 'react';

import { useBranches } from 'hooks/query';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const JournalSheetHeaderDimensionsPanelContext = React.createContext();

/**
 * Journal sheet header provider.
 * @returns
 */
function JournalSheetHeaderDimensionsProvider({ ...props }) {
  // Fetches the branches list.
  const { isLoading: isBranchesLoading, data: branches } = useBranches();

  // Provider
  const provider = {
    branches,
    isBranchesLoading,
  };

  return isBranchesLoading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <JournalSheetHeaderDimensionsPanelContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useJournalSheetHeaderDimensionsPanelContext = () =>
  React.useContext(JournalSheetHeaderDimensionsPanelContext);

export {
  JournalSheetHeaderDimensionsProvider,
  useJournalSheetHeaderDimensionsPanelContext,
};
