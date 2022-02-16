import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import { FinancialStatement } from 'components';
import { TrialBalanceSheetProvider } from './TrialBalanceProvider';
import TrialBalanceActionsBar from './TrialBalanceActionsBar';
import TrialBalanceSheetHeader from './TrialBalanceSheetHeader';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import {
  TrialBalanceSheetAlerts,
  TrialBalanceSheetLoadingBar,
} from './components';
import { TrialBalanceSheetBody } from './TrialBalanceSheetBody';

import withTrialBalanceActions from './withTrialBalanceActions';

import { getDefaultTrialBalanceQuery } from './utils';
import { compose } from 'utils';

/**
 * Trial balance sheet.
 */
function TrialBalanceSheet({
  // #withTrialBalanceSheetActions
  toggleTrialBalanceFilterDrawer: toggleFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    ...getDefaultTrialBalanceQuery(),
  });

  // Handle filter form submit.
  const handleFilterSubmit = useCallback(
    (filter) => {
      const parsedFilter = {
        ...filter,
        fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filter.toDate).format('YYYY-MM-DD'),
      };
      setFilter(parsedFilter);
    },
    [setFilter],
  );
  // Handle numebr format form submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    setFilter({
      ...filter,
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
    <TrialBalanceSheetProvider query={filter}>
      <TrialBalanceActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <TrialBalanceSheetLoadingBar />
      <TrialBalanceSheetAlerts />

      <DashboardPageContent>
        <FinancialStatement>
          <TrialBalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <TrialBalanceSheetBody />
        </FinancialStatement>
      </DashboardPageContent>
    </TrialBalanceSheetProvider>
  );
}

export default compose(withTrialBalanceActions)(TrialBalanceSheet);
