import React, { useEffect } from 'react';
import moment from 'moment';

import { FinancialStatement } from '@/components';
import DashboardPageContent from '@/components/Dashboard/DashboardPageContent';

import CashFlowStatementHeader from './CashFlowStatementHeader';
import CashFlowStatementActionsBar from './CashFlowStatementActionsBar';
import { CashFlowStatementBody } from './CashFlowStatementBody';

import withCashFlowStatementActions from './withCashFlowStatementActions';
import { CashFlowStatementProvider } from './CashFlowStatementProvider';
import {
  CashFlowStatementLoadingBar,
  CashFlowStatementAlerts,
} from './components';

import { useCashflowStatementQuery } from './utils';
import { compose } from '@/utils';

/**
 * Cash flow statement.
 * @returns {JSX.Element}
 */
function CashFlowStatement({
  // # withCashStatementActions
  toggleCashFlowStatementFilterDrawer,
}) {
  // Cashflow statement query.
  const { query, setLocationQuery } = useCashflowStatementQuery();

  // Handle refetch cash flow after filter change.
  const handleFilterSubmit = (filter) => {
    const newFilter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setLocationQuery({ ...newFilter });
  };
  // Handle format number submit.
  const handleNumberFormatSubmit = (values) => {
    setLocationQuery({
      ...query,
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
    <CashFlowStatementProvider filter={query}>
      <CashFlowStatementActionsBar
        numberFormat={query.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <CashFlowStatementLoadingBar />
      <CashFlowStatementAlerts />

      <DashboardPageContent>
        <FinancialStatement>
          <CashFlowStatementHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <CashFlowStatementBody />
        </FinancialStatement>
      </DashboardPageContent>
    </CashFlowStatementProvider>
  );
}

export default compose(withCashFlowStatementActions)(CashFlowStatement);
