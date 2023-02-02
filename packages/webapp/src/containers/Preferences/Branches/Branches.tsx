// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import BranchesDataTable from './BranchesDataTable';
import BranchesEmptyStatus from './BranchesEmptyStatus';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import { useBranchesContext } from './BranchesProvider';

import { compose } from '@/utils';

function Branches({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { isEmptyStatus } = useBranchesContext();

  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('branches.label'));
  }, [changePreferencesPageTitle]);

  return (
    <React.Fragment>
      {isEmptyStatus ? <BranchesEmptyStatus /> : <BranchesDataTable />}
    </React.Fragment>
  );
}
export default compose(withDashboardActions)(Branches);
