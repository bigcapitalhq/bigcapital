import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useBranches } from 'hooks/query';
import { useFeatureCan } from 'hooks/state';
import { Features } from 'common';
import { isEmpty } from 'lodash';

const BranchesContext = React.createContext();

/**
 * Branches data provider.
 */
function BranchesProvider({ ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches the branches list.
  const {
    isLoading: isBranchesLoading,
    isFetching: isBranchesFetching,
    data: branches,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  // Detarmines the datatable empty status.
  const isEmptyStatus = isEmpty(branches) || !isBranchFeatureCan;

  // Provider state.
  const provider = {
    branches,
    isBranchesLoading,
    isBranchesFetching,
    isEmptyStatus,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_BRANCHES,
      )}
    >
      <BranchesContext.Provider value={provider} {...props} />
    </div>
  );
}

const useBranchesContext = () => React.useContext(BranchesContext);
export { BranchesProvider, useBranchesContext };
