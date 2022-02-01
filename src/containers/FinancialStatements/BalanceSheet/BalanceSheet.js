import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { BalanceSheetAlerts, BalanceSheetLoadingBar } from './components';
import { FinancialStatement } from 'components';

import BalanceSheetHeader from './BalanceSheetHeader';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import BalanceSheetActionsBar from './BalanceSheetActionsBar';
import { BalanceSheetProvider } from './BalanceSheetProvider';
import { BalanceSheetBody } from './BalanceSheetBody';

import withBalanceSheetActions from './withBalanceSheetActions';

import { compose } from 'utils';

/**
 * Balance sheet.
 * @returns {React.JSX}
 */
function BalanceSheet({
  // #withBalanceSheetActions
  toggleBalanceSheetFilterDrawer,
}) {
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    displayColumnsType: 'total',
    filterByOption: 'without-zero-balance',
  });
  // Handle re-fetch balance sheet after filter change.
  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
    setFilter({
      ...filter,
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
    <BalanceSheetProvider filter={filter}>
      <BalanceSheetActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <BalanceSheetLoadingBar />
      <BalanceSheetAlerts />

      <DashboardPageContent>
        <FinancialStatement>
          <BalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <BalanceSheetBody />
        </FinancialStatement>
      </DashboardPageContent>
    </BalanceSheetProvider>
  );
}

export default compose(withBalanceSheetActions)(BalanceSheet);
