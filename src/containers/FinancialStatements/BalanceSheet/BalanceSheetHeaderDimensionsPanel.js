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
        name={'branches_id'}
        branches={branches}
        input={BranchMulitSelectButton}
        // onItemSelect={}
        popoverProps={{ minimal: true }}
      />
    </div>
  );
}

export default BalanceSheetHeaderDimensionsPanel;

function BranchMulitSelectButton() {
  return <Button text={'Button'} minimal={true} />;
}
