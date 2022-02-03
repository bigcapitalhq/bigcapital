import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { Card } from 'components';
import { useBranches } from 'hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const BranchesContext = React.createContext();

/**
 * Branches data provider.
 */
function BranchesProvider({ ...props }) {
  // Fetches the branches list.
  const {
    isLoading: isBranchesLoading,
    isFetching: isBranchesFetching,
    data: branches,
  } = useBranches();

  // Provider state.
  const provider = {
    branches,
    isBranchesLoading,
    isBranchesFetching,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_BRANCHES,
      )}
    >
      <BrachesPreferencesCard>
        <BranchesContext.Provider value={provider} {...props} />
      </BrachesPreferencesCard>
    </div>
  );
}

const useBranchesContext = () => React.useContext(BranchesContext);
export { BranchesProvider, useBranchesContext };

const BrachesPreferencesCard = styled(Card)`
  padding: 0;
`;
