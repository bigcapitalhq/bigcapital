import React, { useEffect } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import EstimateActionsBar from './EstimateActionsBar';
import EstimatesAlerts from './EstimatesAlerts';
import EstiamtesViewPage from './EstiamtesViewPage';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withEstimates from './withEstimates';

import { EstimatesListProvider } from './EstimatesListProvider';
import { compose } from 'utils';

/**
 * Sale estimates list page.
 */
function EstimatesList({
  // #withDashboardActions
  changePageTitle,

  // #withEstimate
  estimatesTableQuery,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'estimates_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <EstimatesListProvider query={estimatesTableQuery}>
      <EstimateActionsBar />

      <DashboardPageContent>
        <EstiamtesViewPage />
        <EstimatesAlerts />
      </DashboardPageContent>
    </EstimatesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withEstimates(({ estimatesTableQuery }) => ({
    estimatesTableQuery,
  })),
)(EstimatesList);
