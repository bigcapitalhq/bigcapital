import moment from 'moment';
import React from 'react';
import { ProfitLossSheetAlerts, ProfitLossSheetLoadingBar } from './components';
import { ProfitLossActionsBar } from './ProfitLossActionsBar';
import { ProfitLossBody } from './ProfitLossBody';
import { ProfitLossSheetProvider } from './ProfitLossProvider';
import { ProfitLossSheetDialogs } from './ProfitLossSheetDialogs';
import { ProfitLossSheetHeader } from './ProfitLossSheetHeader';
import { useProfitLossSheetQuery } from './utils';
import {
  withProfitLossActions,
  WithProfitLossActionsProps,
} from './withProfitLossActions';
import { DashboardPageContent } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { compose } from '@/utils';

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

export const ProfitLossSheet = compose(
  withDashboardActions,
  withProfitLossActions,
)(ProfitLossSheetInner);
