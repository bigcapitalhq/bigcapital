import React from 'react';
import { RealizedGainOrLossLoadingBar } from './components';
import { RealizedGainOrLossActionsBar } from './RealizedGainOrLossActionsBar';
import { RealizedGainOrLossHeader } from './RealizedGainOrLossHeader';
import { RealizedGainOrLossProvider } from './RealizedGainOrLossProvider';
import { WithRealizedGainOrLossActionsProps } from './withRealizedGainOrLossActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

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
