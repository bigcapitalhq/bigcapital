// @ts-nocheck
import React from 'react';

import { FinancialStatement, DashboardPageContent } from '@/components';

import RealizedGainOrLossHeader from './RealizedGainOrLossHeader';
import RealizedGainOrLossActionsBar from './RealizedGainOrLossActionsBar';
import { RealizedGainOrLossLoadingBar } from './components';
import { RealizedGainOrLossProvider } from './RealizedGainOrLossProvider';

import withCurrentOrganization from '../../Organization/withCurrentOrganization';
import withRealizedGainOrLossActions from './withRealizedGainOrLossActions';

import { compose } from '@/utils';

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
