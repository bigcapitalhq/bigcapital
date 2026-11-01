import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import { BranchesDataTable } from './BranchesDataTable';
import { BranchesEmptyStatus } from './BranchesEmptyStatus';
import { useBranchesContext } from './BranchesProvider';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';

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
export const Branches = FF.pipe(BranchesInner, withDashboardActions);
