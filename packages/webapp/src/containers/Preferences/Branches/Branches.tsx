import React from 'react';
import intl from 'react-intl-universal';
import { BranchesDataTable } from './BranchesDataTable';
import { BranchesEmptyStatus } from './BranchesEmptyStatus';
import { useBranchesContext } from './BranchesProvider';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { compose } from '@/utils';

type BranchesInnerProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

function BranchesInner({
  // #withDashboardActions
  changePreferencesPageTitle,
}: BranchesInnerProps) {
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
export const Branches = compose(withDashboardActions)(BranchesInner);
