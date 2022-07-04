import React, { useCallback, useEffect } from 'react';
import moment from 'moment';

import { FinancialStatement } from '@/components';
import { TrialBalanceSheetProvider } from './TrialBalanceProvider';
import TrialBalanceActionsBar from './TrialBalanceActionsBar';
import TrialBalanceSheetHeader from './TrialBalanceSheetHeader';

import DashboardPageContent from '@/components/Dashboard/DashboardPageContent';
import {
  TrialBalanceSheetAlerts,
  TrialBalanceSheetLoadingBar,
} from './components';
import { TrialBalanceSheetBody } from './TrialBalanceSheetBody';

import withTrialBalanceActions from './withTrialBalanceActions';

import { useTrialBalanceSheetQuery } from './utils';
import { compose } from 'utils';

/**
 * Trial balance sheet.
 */
function TrialBalanceSheet({
  // #withTrialBalanceSheetActions
  toggleTrialBalanceFilterDrawer: toggleFilterDrawer,
}) {
  const { query, setLocationQuery } = useTrialBalanceSheetQuery();

  // Handle filter form submit.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const parsedFilter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setLocationQuery(parsedFilter);
    },
    [setLocationQuery],
  );
  // Handle numebr format form submit.
  const handleNumberFormatSubmit = (numberFormat) => {
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
    </TrialBalanceSheetProvider>
  );
}

export default compose(withTrialBalanceActions)(TrialBalanceSheet);
