import React from 'react';
import { DashboardContentTable, DashboardPageContent } from 'components';

import 'style/pages/SaleEstimate/List.scss';

import EstimatesActionsBar from './EstimatesActionsBar';
import EstimatesAlerts from '../EstimatesAlerts';
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

  // #withEstimatesActions
  setEstimatesTableState
}) {
  // Resets the estimates table state once the page unmount.
  React.useEffect(
    () => () => {
      setEstimatesTableState({
        filterRoles: [],
        viewSlug: '',
        pageIndex: 0,
      });
    },
    [setEstimatesTableState],
  );

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
  withEstimatesActions
)(EstimatesList);
