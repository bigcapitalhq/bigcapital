import React, { useEffect } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import EstimatesActionsBar from './EstimatesActionsBar';
import EstimatesAlerts from '../EstimatesAlerts';
import EstimatesViewTabs from './EstimatesViewTabs';
import EstimatesDataTable from './EstimatesDataTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withEstimates from './withEstimates';

import { EstimatesListProvider } from './EstimatesListProvider';
import { compose, transformTableStateToQuery } from 'utils';

/**
 * Sale estimates list page.
 */
function EstimatesList({
  // #withDashboardActions
  changePageTitle,

  // #withEstimate
  estimatesTableState,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'estimates_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <EstimatesListProvider
      query={transformTableStateToQuery(estimatesTableState)}
    >
      <EstimatesActionsBar />

      <DashboardPageContent>
        <EstimatesViewTabs />
        <EstimatesDataTable />
      </DashboardPageContent>

      <EstimatesAlerts />
    </EstimatesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withEstimates(({ estimatesTableState }) => ({ estimatesTableState })),
)(EstimatesList);
