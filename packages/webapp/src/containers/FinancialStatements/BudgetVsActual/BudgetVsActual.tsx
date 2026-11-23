import { NonIdealState } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import moment from 'moment';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { BudgetVsActualActionsBar } from './BudgetVsActualActionsBar';
import { BudgetVsActualBody } from './BudgetVsActualBody';
import { BudgetVsActualBoot } from './BudgetVsActualBoot';
import { BudgetVsActualHeader } from './BudgetVsActualHeader';
import { BudgetVsActualPdfDialog } from './BudgetVsActualPdfDialog';
import { BudgetVsActualLoadingBar } from './components';
import { useBudgetVsActualQuery } from './utils';
import {
  withBudgetVsActualActions,
  WithBudgetVsActualActionsProps,
} from './withBudgetVsActualActions';
import {
  Can,
  Card,
  DashboardPageContent,
  FinancialStatement,
} from '@/components';
import { AbilitySubject, ReportsAction } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';

interface BudgetVsActualProps extends WithBudgetVsActualActionsProps {}

/**
 * Budget vs actual report.
 */
function BudgetVsActualInner({
  // #withBudgetVsActualActions
  toggleBudgetVsActualFilterDrawer,
}: BudgetVsActualProps) {
  const [query, setQuery] = useBudgetVsActualQuery();

  const handleFilterSubmit = (filter: Record<string, any>) => {
    const newFilter = {
      ...filter,
      fromDate: filter.fromDate
        ? moment(filter.fromDate).format('YYYY-MM-DD')
        : '',
      toDate: filter.toDate ? moment(filter.toDate).format('YYYY-MM-DD') : '',
    };
    setQuery({ ...newFilter });
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    setQuery({
      ...query,
      numberFormat: values,
    });
  };
  // Hides the filter drawer once the page unmount.
  useEffect(
    () => () => {
      toggleBudgetVsActualFilterDrawer(false);
    },
    [toggleBudgetVsActualFilterDrawer],
  );

  return (
    <BudgetVsActualBoot filter={query}>
      <BudgetVsActualActionsBar
        numberFormat={query.numberFormat ?? {}}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <BudgetVsActualLoadingBar />

      <DashboardPageContent>
        <FinancialStatement>
          <BudgetVsActualHeader
            pageFilter={query}
            onSubmitFilter={handleFilterSubmit}
          />
          <BudgetVsActualBody />
        </FinancialStatement>
      </DashboardPageContent>

      <BudgetVsActualPdfDialog
        dialogName={DialogsName.BudgetVsActualPdfPreview}
      />
    </BudgetVsActualBoot>
  );
}

const BudgetVsActualConnected = FF.pipe(
  BudgetVsActualInner,
  withBudgetVsActualActions,
);

/**
 * Budget vs actual report page.
 */
export function BudgetVsActual() {
  return (
    <>
      <Can I={ReportsAction.READ_BUDGET_VS_ACTUAL} a={AbilitySubject.Report}>
        <BudgetVsActualConnected />
      </Can>

      <Can
        not
        I={ReportsAction.READ_BUDGET_VS_ACTUAL}
        a={AbilitySubject.Report}
      >
        <DashboardPageContent>
          <Card style={{ padding: 20 }}>
            <NonIdealState title={intl.get('budget_vs_actual.no_access')} />
          </Card>
        </DashboardPageContent>
      </Can>
    </>
  );
}
