import React from 'react';

import { Features } from 'common';
import { useBranches } from 'hooks/query';
import { useFeatureCan } from 'hooks/state';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const JournalSheetHeaderDimensionsPanelContext = React.createContext();

/**
 * Journal sheet header provider.
 * @returns
 */
function JournalSheetHeaderDimensionsProvider({ query, ...props }) {
  const { featureCan } = useFeatureCan();
  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches the branches list.
  const { isLoading: isBranchesLoading, data: branches } = useBranches(query, {
    enabled: isBranchFeatureCan,
  });

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
