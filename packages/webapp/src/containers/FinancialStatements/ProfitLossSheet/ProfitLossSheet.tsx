import React from 'react';
import moment from 'moment';
import { ProfitLossSheetHeader } from './ProfitLossSheetHeader';
import { ProfitLossActionsBar } from './ProfitLossActionsBar';
import { DashboardPageContent } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import {
  withProfitLossActions,
  WithProfitLossActionsProps,
} from './withProfitLossActions';
import { useProfitLossSheetQuery } from './utils';
import { ProfitLossSheetProvider } from './ProfitLossProvider';
import { ProfitLossSheetAlerts, ProfitLossSheetLoadingBar } from './components';
import { ProfitLossBody } from './ProfitLossBody';
import { ProfitLossSheetDialogs } from './ProfitLossSheetDialogs';
import { flow } from 'fp-ts/function';

type ProfitLossSheetProps = Pick<
  WithProfitLossActionsProps,
  'toggleProfitLossFilterDrawer'
>;

function ProfitLossSheetInner({
  toggleProfitLossFilterDrawer: toggleDisplayFilterDrawer,
}: ProfitLossSheetProps) {
  const { query, setLocationQuery } = useProfitLossSheetQuery();

  const handleSubmitFilter = (filter: Record<string, unknown>) => {
    const newFilter = {
      ...filter,
      fromDate: moment(filter.fromDate as string).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate as string).format('YYYY-MM-DD'),
    };
    setLocationQuery(newFilter);
  };

  const handleNumberFormatSubmit = (numberFormat: Record<string, unknown>) => {
    setLocationQuery({
      ...query,
      numberFormat,
    });
  };

  React.useEffect(
    () => () => {
      toggleDisplayFilterDrawer(false);
    },
    [toggleDisplayFilterDrawer],
  );

  return (
    <ProfitLossSheetProvider query={query}>
      <ProfitLossActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <ProfitLossSheetLoadingBar />
      <ProfitLossSheetAlerts />

      <DashboardPageContent>
        <ProfitLossSheetHeader
          pageFilter={query}
          onSubmitFilter={handleSubmitFilter}
        />
        <ProfitLossBody />
      </DashboardPageContent>

      <ProfitLossSheetDialogs />
    </ProfitLossSheetProvider>
  );
}

export const ProfitLossSheet = flow(
  withProfitLossActions,
  withDashboardActions,
)(ProfitLossSheetInner);
