import React from 'react';
import { DashboardPageContent } from '@/components';

import '@/style/pages/SaleEstimate/List.scss';
import { EstimatesActionsBar } from './EstimatesActionsBar';
import { EstimatesDataTable } from './EstimatesDataTable';
import { EstimatesListDialogs } from './EstimatesListDialogs';
import { EstimatesListDrawers } from './EstimatesListDrawers';
import { EstimatesListProvider } from './EstimatesListProvider';
import { withEstimates } from './withEstimates';
import { withEstimatesActions } from './withEstimatesActions';
import type { WithEstimatesProps } from './withEstimates';
import { compose, transformTableStateToQuery } from '@/utils';

interface WithEstimatesActionsProps {
  resetEstimatesTableState: () => void;
}

interface EstimatesListProps
  extends Pick<
      WithEstimatesProps,
      'estimatesTableState' | 'estimatesTableStateChanged'
    >,
    WithEstimatesActionsProps {}

function EstimatesListInner({
  estimatesTableState,
  estimatesTableStateChanged,
  resetEstimatesTableState,
}: EstimatesListProps) {
  React.useEffect(
    () => () => {
      resetEstimatesTableState();
    },
    [resetEstimatesTableState],
  );

  return (
    <EstimatesListProvider
      query={transformTableStateToQuery(estimatesTableState)}
      tableStateChanged={estimatesTableStateChanged}
    >
      <EstimatesActionsBar />
      <EstimatesListDrawers />
      <EstimatesListDialogs />

      <DashboardPageContent>
        <EstimatesDataTable />
      </DashboardPageContent>
    </EstimatesListProvider>
  );
}

export const EstimatesList = compose(
  withEstimates(({ estimatesTableState, estimatesTableStateChanged }) => ({
    estimatesTableState,
    estimatesTableStateChanged,
  })),
  withEstimatesActions,
)(EstimatesListInner);
