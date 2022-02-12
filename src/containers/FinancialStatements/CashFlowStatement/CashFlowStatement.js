import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { FinancialStatement } from 'components';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import CashFlowStatementHeader from './CashFlowStatementHeader';
import CashFlowStatementActionsBar from './CashFlowStatementActionsBar';
import { CashFlowStatementBody } from './CashFlowStatementBody';

import withCashFlowStatementActions from './withCashFlowStatementActions';
import { CashFlowStatementProvider } from './CashFlowStatementProvider';
import {
  CashFlowStatementLoadingBar,
  CashFlowStatementAlerts,
} from './components';

import { compose } from 'utils';

/**
 * Cash flow statement.
 */
function CashFlowStatement({
  //#withCashStatementActions
  toggleCashFlowStatementFilterDrawer,
}) {
  // filter
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'cash',
    displayColumnsType: 'total',
    filterByOption: 'with-transactions',
  });

  // Handle refetch cash flow after filter change.
  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
  };

  // Handle format number submit.
  const handleNumberFormatSubmit = (values) => {
    setFilter({
      ...filter,
      numberFormat: values,
    });
  };

  useEffect(
    () => () => {
      toggleCashFlowStatementFilterDrawer(false);
    },
    [toggleCashFlowStatementFilterDrawer],
  );

  return (
    <CashFlowStatementProvider filter={filter}>
      <CashFlowStatementActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <CashFlowStatementLoadingBar />
      <CashFlowStatementAlerts />

      <DashboardPageContent>
        <FinancialStatement>
          <CashFlowStatementHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />
          <CashFlowStatementBody />
        </FinancialStatement>
      </DashboardPageContent>
    </CashFlowStatementProvider>
  );
}

export default compose(withCashFlowStatementActions)(CashFlowStatement);
