import React, { useCallback, useEffect } from 'react';
import moment from 'moment';

import { FinancialStatement, DashboardPageContent } from '@/components';
import { TrialBalanceSheetBody } from './TrialBalanceSheetBody';
import { TrialBalanceSheetProvider } from './TrialBalanceProvider';
import { useTrialBalanceSheetQuery } from './utils';
import { TrialBalanceActionsBar } from './TrialBalanceActionsBar';
import { TrialBalanceSheetHeader } from './TrialBalanceSheetHeader';

import {
  TrialBalanceSheetAlerts,
  TrialBalanceSheetLoadingBar,
} from './components';

import {
  withTrialBalanceActions,
  WithTrialBalanceActionsProps,
} from './withTrialBalanceActions';
import { TrialBalanceSheetDialogs } from './TrialBalanceSheetDialogs';
import { flow } from 'fp-ts/function';

type TrialBalanceSheetProps = Pick<
  WithTrialBalanceActionsProps,
  'toggleTrialBalanceFilterDrawer'
>;

/**
 * Trial balance sheet.
 */
function TrialBalanceSheetInner({
  // #withTrialBalanceSheetActions
  toggleTrialBalanceFilterDrawer: toggleFilterDrawer,
}: TrialBalanceSheetProps) {
  const { query, setLocationQuery } = useTrialBalanceSheetQuery();

  // Handle filter form submit.
  const handleFilterSubmit = useCallback(
    (filter: Record<string, unknown>) => {
      const parsedFilter = {
        ...filter,
        fromDate: moment(filter.fromDate as Date).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate as Date).format('YYYY-MM-DD'),
      };
      setLocationQuery(parsedFilter);
    },
    [setLocationQuery],
  );
  // Handle number format form submit.
  const handleNumberFormatSubmit = (numberFormat: Record<string, unknown>) => {
    setLocationQuery({
      ...query,
      numberFormat,
    });
  };
  // Hide the filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleFilterDrawer(false);
    },
    [toggleFilterDrawer],
  );

  return (
    <TrialBalanceSheetProvider query={query}>
      <TrialBalanceActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <TrialBalanceSheetLoadingBar />
      <TrialBalanceSheetAlerts />

      <DashboardPageContent>
        <FinancialStatement>
          <TrialBalanceSheetHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <TrialBalanceSheetBody />
        </FinancialStatement>
      </DashboardPageContent>

      <TrialBalanceSheetDialogs />
    </TrialBalanceSheetProvider>
  );
}

export const TrialBalanceSheet = flow(withTrialBalanceActions)(
  TrialBalanceSheetInner,
);
