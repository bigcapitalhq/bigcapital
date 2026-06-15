import React from 'react';

import { FinancialStatement, DashboardPageContent } from '@/components';

import { RealizedGainOrLossHeader } from './RealizedGainOrLossHeader';
import { RealizedGainOrLossActionsBar } from './RealizedGainOrLossActionsBar';
import { RealizedGainOrLossLoadingBar } from './components';
import { RealizedGainOrLossProvider } from './RealizedGainOrLossProvider';

import { WithRealizedGainOrLossActionsProps } from './withRealizedGainOrLossActions';

type RealizedGainOrLossProps = {
  organizationName: string;
} & Pick<
  WithRealizedGainOrLossActionsProps,
  'toggleRealizedGainOrLossFilterDrawer'
>;

function RealizedGainOrLoss({
  toggleRealizedGainOrLossFilterDrawer,
}: RealizedGainOrLossProps) {
  const handleFilterSubmit = (_filter: Record<string, unknown>) => {};

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
            pageFilter={{}}
            onSubmitFilter={handleFilterSubmit}
          />
          <RealizedGainOrLossLoadingBar />
        </FinancialStatement>
      </DashboardPageContent>
    </RealizedGainOrLossProvider>
  );
}

export { RealizedGainOrLoss };
