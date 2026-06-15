// @ts-nocheck
import React from 'react';
import { DashboardPageContent } from '@/components';

import '@/style/pages/SaleEstimate/List.scss';

import { EstimatesActionsBar } from './EstimatesActionsBar';
import { EstimatesDataTable } from './EstimatesDataTable';

import { withEstimates } from './withEstimates';
import { withEstimatesActions } from './withEstimatesActions';

import { EstimatesListProvider } from './EstimatesListProvider';
import { transformTableStateToQuery } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * Sale estimates list page.
 */
function EstimatesListInner({
  // #withEstimate
  estimatesTableState,
  estimatesTableStateChanged,

  // #withEstimatesActions
  resetEstimatesTableState,
}) {
  // Resets the estimates table state once the page unmount.
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

      <DashboardPageContent>
        <EstimatesDataTable />
      </DashboardPageContent>
    </EstimatesListProvider>
  );
}

export const EstimatesList = flow(
  withEstimatesActions,
  withEstimates(({ estimatesTableState, estimatesTableStateChanged }) => ({
    estimatesTableState,
    estimatesTableStateChanged,
  })),
)(EstimatesListInner);
