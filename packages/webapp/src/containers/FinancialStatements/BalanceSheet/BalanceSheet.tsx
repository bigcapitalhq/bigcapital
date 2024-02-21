// @ts-nocheck
import React, { useEffect } from 'react';
import moment from 'moment';

import { BalanceSheetAlerts, BalanceSheetLoadingBar } from './components';
import { FinancialStatement, DashboardPageContent } from '@/components';

import BalanceSheetHeader from './BalanceSheetHeader';
import BalanceSheetActionsBar from './BalanceSheetActionsBar';
import { BalanceSheetProvider } from './BalanceSheetProvider';
import { BalanceSheetBody } from './BalanceSheetBody';
import { useBalanceSheetQuery } from './utils';
import { compose } from '@/utils';

import withBalanceSheetActions from './withBalanceSheetActions';
import { BalanceSheetDialogs } from './BalanceSheetDialogs';

/**
 * Balance sheet.
 * @returns {React.JSX}
 */
function BalanceSheet({
  // #withBalanceSheetActions
  toggleBalanceSheetFilterDrawer,
}) {
  // Balance sheet query.
  const { query, setLocationQuery } = useBalanceSheetQuery();

  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = (filter) => {
    const newFilter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setLocationQuery({ ...newFilter });
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
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
        numberFormat={query.numberFormat}
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

export default compose(withBalanceSheetActions)(BalanceSheet);
