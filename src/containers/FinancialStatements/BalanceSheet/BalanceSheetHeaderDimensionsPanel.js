import React from 'react';
import { Button } from '@blueprintjs/core';
import { BranchesMultiSelect } from 'components';

import { useBranches } from 'hooks/query';

function BalanceSheetHeaderDimensionsPanel() {
  // Fetches the branches list.
  const {
    isLoading: isBranchesLoading,
    isFetching: isBranchesFetching,
    data: branches,
  } = useBranches();
  return (
    <div>
      <BranchesMultiSelect
        name={'branchesIds'}
        branches={branches}
        popoverProps={{ minimal: true }}
      />
    </div>
  );
}

export default BalanceSheetHeaderDimensionsPanel;
