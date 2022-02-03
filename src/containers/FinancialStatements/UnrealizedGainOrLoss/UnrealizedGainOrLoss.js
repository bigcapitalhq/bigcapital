import React from 'react';

import { FinancialStatement } from 'components';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import UnrealizedGainOrLossHeader from './UnrealizedGainOrLossHeader';
import UnrealizedGainOrLossTable from './UnrealizedGainOrLossTable';
import UnrealizedGainOrLossActionsBar from './UnrealizedGainOrLossActionsBar';

import withCurrentOrganization from '../../Organization/withCurrentOrganization';
import withUnrealizedGainOrLossActions from './withUnrealizedGainOrLossActions';
import { UnrealizedGainOrLossProvider } from './UnrealizedGainOrLossProvider';
import { UnrealizedGainOrLossLoadingBar } from './components';

import { compose } from 'utils';

/**
 * Unrealized Gain or Loss
 */
function UnrealizedGainOrLoss({
  // #withPreferences
  organizationName,

  //#withUnrealizedGainOrLossActions
  toggleUnrealizedGainOrLossFilterDrawer,
}) {
  // Handle refetch unrealized Gain or Loss after filter change.
  const handleFilterSubmit = (filter) => {};

  // Handle format number submit.
  const handleNumberFormatSubmit = (values) => {};

  React.useEffect(
    () => () => {
      toggleUnrealizedGainOrLossFilterDrawer(false);
    },
    [toggleUnrealizedGainOrLossFilterDrawer],
  );

  return (
    <UnrealizedGainOrLossProvider>
      <UnrealizedGainOrLossActionsBar />
      <DashboardPageContent>
        <FinancialStatement>
          <UnrealizedGainOrLossHeader
            pageFilter={[]}
            onSubmitFilter={handleFilterSubmit}
          />

          <UnrealizedGainOrLossLoadingBar />
          <div className="financial-statement__body">
            <UnrealizedGainOrLossTable companyName={organizationName} />
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </UnrealizedGainOrLossProvider>
  );
}

export default compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
  withUnrealizedGainOrLossActions,
)(UnrealizedGainOrLoss);
