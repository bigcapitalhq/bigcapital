import React from 'react';

import { FinancialStatement } from 'components';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import RealizedGainOrLossHeader from './RealizedGainOrLossHeader';
import RealizedGainOrLossTable from './RealizedGainOrLossTable';
import RealizedGainOrLossActionsBar from './RealizedGainOrLossActionsBar';

import withCurrentOrganization from '../../Organization/withCurrentOrganization';
import withRealizedGainOrLossActions from './withRealizedGainOrLossActions';
import { RealizedGainOrLossProvider } from './RealizedGainOrLossProvider';
import { RealizedGainOrLossLoadingBar } from './components';

import { compose } from 'utils';

/**
 * Realized Gain or Loss.
 */
function RealizedGainOrLoss({
  // #withPreferences
  organizationName,

  //#withRealizedGainOrLossActions
  toggleRealizedGainOrLossFilterDrawer,
}) {
  // Handle refetch realized Gain or Loss after filter change.
  const handleFilterSubmit = (filter) => {};

  // Handle format number submit.
  const handleNumberFormatSubmit = (values) => {};

  React.useEffect(
    () => () => {
      toggleRealizedGainOrLossFilterDrawer(false);
    },
    [toggleRealizedGainOrLossFilterDrawer],
  );

  return (
    <RealizedGainOrLossProvider>
      <RealizedGainOrLossActionsBar />

      <DashboardPageContent>
        <FinancialStatement>
          <RealizedGainOrLossHeader
            pageFilter={[]}
            onSubmitFilter={handleFilterSubmit}
          />
          <RealizedGainOrLossLoadingBar />

          <div className="financial-statement__body">
            <RealizedGainOrLossTable companyName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </RealizedGainOrLossProvider>
  );
}

export default compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
  withRealizedGainOrLossActions,
)(RealizedGainOrLoss);
