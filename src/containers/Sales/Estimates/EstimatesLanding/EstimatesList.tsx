import React from 'react';
import { DashboardContentTable, DashboardPageContent } from '@/components';

import 'style/pages/SaleEstimate/List.scss';

import EstimatesActionsBar from './EstimatesActionsBar';
import EstimatesViewTabs from './EstimatesViewTabs';
import EstimatesDataTable from './EstimatesDataTable';

import withEstimates from './withEstimates';
import withEstimatesActions from './withEstimatesActions';

import { EstimatesListProvider } from './EstimatesListProvider';
import { compose, transformTableStateToQuery } from 'utils';

/**
 * Sale estimates list page.
 */
function EstimatesList({
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
        <EstimatesViewTabs />
        <EstimatesDataTable />
      </DashboardPageContent>
    </EstimatesListProvider>
  );
}

export default compose(
  withEstimates(({ estimatesTableState, estimatesTableStateChanged }) => ({
    estimatesTableState,
    estimatesTableStateChanged,
  })),
  withEstimatesActions,
)(EstimatesList);
