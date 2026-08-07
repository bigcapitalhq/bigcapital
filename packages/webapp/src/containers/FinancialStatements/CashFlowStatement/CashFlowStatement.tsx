import moment from 'moment';
import React, { useEffect } from 'react';
import { CashflowSheetDialogs } from './CashflowSheetDialogs';
import { CashFlowStatementActionsBar } from './CashFlowStatementActionsBar';
import { CashFlowStatementBody } from './CashFlowStatementBody';
import { CashFlowStatementHeader } from './CashFlowStatementHeader';
import { CashFlowStatementProvider } from './CashFlowStatementProvider';
import {
  CashFlowStatementLoadingBar,
  CashFlowStatementAlerts,
} from './components';
import { useCashflowStatementQuery } from './utils';
import {
  withCashFlowStatementActions,
  WithCashFlowStatementActionsProps,
} from './withCashFlowStatementActions';
import { FinancialStatement, DashboardPageContent } from '@/components';
import { compose } from '@/utils';

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

export const CashFlowStatement = compose(withCashFlowStatementActions)(
  CashFlowStatementInner,
);
