import * as FF from 'fp-ts/function';
import moment from 'moment';
import { useEffect } from 'react';
import { writeReportingPeriod } from '../reportingPeriod';
import { BalanceSheetActionsBar } from './BalanceSheetActionsBar';
import { BalanceSheetBody } from './BalanceSheetBody';
import { BalanceSheetDialogs } from './BalanceSheetDialogs';
import { BalanceSheetHeader } from './BalanceSheetHeader';
import { BalanceSheetProvider } from './BalanceSheetProvider';
import { BalanceSheetAlerts, BalanceSheetLoadingBar } from './components';
import { useBalanceSheetQuery } from './utils';
import {
  withBalanceSheetActions,
  WithBalanceSheetActionsProps,
} from './withBalanceSheetActions';
import { FinancialStatement, DashboardPageContent } from '@/components';

interface BalanceSheetFilterValues {
  fromDate: Date | string;
  toDate: Date | string;
  [key: string]: unknown;
}

/**
 * Balance sheet.
 * @returns {React.JSX}
 */
function BalanceSheetInner({
  // #withBalanceSheetActions
  toggleBalanceSheetFilterDrawer,
}: WithBalanceSheetActionsProps) {
  // Balance sheet query.
  const { query, setLocationQuery } = useBalanceSheetQuery();

  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = (filter: BalanceSheetFilterValues) => {
    const newFilter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    writeReportingPeriod(newFilter);
    setLocationQuery({ ...newFilter });
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    setLocationQuery({
      ...query,
      numberFormat: values,
    });
  };
  // Hides the balance sheet filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleBalanceSheetFilterDrawer(false);
    },
    [toggleBalanceSheetFilterDrawer],
  );

  return (
    <BalanceSheetProvider filter={query}>
      <BalanceSheetActionsBar
        numberFormat={query.numberFormat ?? {}}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <BalanceSheetLoadingBar />
      <BalanceSheetAlerts />

      <DashboardPageContent>
        <FinancialStatement>
          <BalanceSheetHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <BalanceSheetBody />
        </FinancialStatement>
      </DashboardPageContent>

      <BalanceSheetDialogs />
    </BalanceSheetProvider>
  );
}

export const BalanceSheet = FF.pipe(BalanceSheetInner, withBalanceSheetActions);
