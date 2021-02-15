import React from 'react';
import { DashboardContentTable, DashboardPageContent } from 'components';

import EstimatesActionsBar from './EstimatesActionsBar';
import EstimatesAlerts from '../EstimatesAlerts';
import EstimatesViewTabs from './EstimatesViewTabs';
import EstimatesDataTable from './EstimatesDataTable';

import withEstimates from './withEstimates';

import { EstimatesListProvider } from './EstimatesListProvider';
import { compose, transformTableStateToQuery } from 'utils';

/**
 * Sale estimates list page.
 */
function EstimatesList({
  // #withEstimate
  estimatesTableState,
}) {
  return (
    <EstimatesListProvider
      query={transformTableStateToQuery(estimatesTableState)}
    >
      <EstimatesActionsBar />

      <DashboardPageContent>
        <EstimatesViewTabs />

        <DashboardContentTable>
          <EstimatesDataTable />
        </DashboardContentTable>
      </DashboardPageContent>

      <EstimatesAlerts />
    </EstimatesListProvider>
  );
}

export default compose(
  withEstimates(({ estimatesTableState }) => ({ estimatesTableState })),
)(EstimatesList);
