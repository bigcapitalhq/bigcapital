import React, { useEffect } from 'react';
import moment from 'moment';

import { FinancialStatement, DashboardPageContent } from '@/components';
import { CashFlowStatementBody } from './CashFlowStatementBody';
import { CashFlowStatementProvider } from './CashFlowStatementProvider';

import { CashFlowStatementHeader } from './CashFlowStatementHeader';
import { CashFlowStatementActionsBar } from './CashFlowStatementActionsBar';

import {
  withCashFlowStatementActions,
  WithCashFlowStatementActionsProps,
} from './withCashFlowStatementActions';
import {
  CashFlowStatementLoadingBar,
  CashFlowStatementAlerts,
} from './components';

import { useCashflowStatementQuery } from './utils';
import { CashflowSheetDialogs } from './CashflowSheetDialogs';
import { flow } from 'fp-ts/function';

type CashFlowStatementProps = Pick<
  WithCashFlowStatementActionsProps,
  'toggleCashFlowStatementFilterDrawer'
>;

function CashFlowStatementInner({
  toggleCashFlowStatementFilterDrawer,
}: CashFlowStatementProps) {
  const { query, setLocationQuery } = useCashflowStatementQuery();

  const handleFilterSubmit = (filter: Record<string, unknown>) => {
    const newFilter = {
      ...filter,
      fromDate: moment(filter.fromDate as string).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate as string).format('YYYY-MM-DD'),
    };
    setLocationQuery({ ...newFilter });
  };

  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
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

      <CashflowSheetDialogs />
    </CashFlowStatementProvider>
  );
}

export const CashFlowStatement = flow(withCashFlowStatementActions)(
  CashFlowStatementInner,
);
