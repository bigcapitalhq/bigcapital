// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { useBranches } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { Features } from '@/constants';
import { isEmpty } from 'lodash';

const BranchesContext = React.createContext();

/**
 * Branches data provider.
 */
function BranchesProvider({ query, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  const isBranchFeatureCan = featureCan(Features.Branches);

  // Fetches the branches list.
  const {
    isLoading: isBranchesLoading,
    isFetching: isBranchesFetching,
    data: branches,
  } = useBranches(query, { enabled: isBranchFeatureCan });

  // Determines the datatable empty status.
  const isEmptyStatus =
    (isEmpty(branches) && !isBranchesLoading) || !isBranchFeatureCan;

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
