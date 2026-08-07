import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import {
  TrialBalanceSheetAlerts,
  TrialBalanceSheetLoadingBar,
} from './components';
import { TrialBalanceActionsBar } from './TrialBalanceActionsBar';
import { TrialBalanceSheetProvider } from './TrialBalanceProvider';
import { TrialBalanceSheetBody } from './TrialBalanceSheetBody';
import { TrialBalanceSheetDialogs } from './TrialBalanceSheetDialogs';
import { TrialBalanceSheetHeader } from './TrialBalanceSheetHeader';
import { useTrialBalanceSheetQuery } from './utils';
import {
  withTrialBalanceActions,
  WithTrialBalanceActionsProps,
} from './withTrialBalanceActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

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

export const TrialBalanceSheet = compose(withTrialBalanceActions)(
  TrialBalanceSheetInner,
);
